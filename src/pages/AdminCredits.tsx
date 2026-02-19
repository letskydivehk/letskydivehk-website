import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Coins, Search, Plus, Minus, Loader2, User, Clock, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";

interface MemberWithBalance {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  balance: number;
}

export default function AdminCredits() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [members, setMembers] = useState<MemberWithBalance[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberWithBalance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberWithBalance | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [memberTransactions, setMemberTransactions] = useState<any[]>([]);
  const [pendingCredits, setPendingCredits] = useState<any[]>([]);
  const [processingTxId, setProcessingTxId] = useState<string | null>(null);

  // Check admin role
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    const checkRole = async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!data) {
        navigate("/membership", { replace: true });
        return;
      }
      setIsAdmin(true);
      setCheckingAdmin(false);
    };
    checkRole();
  }, [authLoading, user, navigate]);

  // Fetch all members with balances
  const fetchMembers = useCallback(async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, avatar_url")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch balance for each member
      const membersWithBalance: MemberWithBalance[] = await Promise.all(
        (profiles || []).map(async (p) => {
          const { data: balance } = await supabase.rpc("get_credit_balance", { _user_id: p.user_id });
          return { ...p, balance: balance || 0 };
        })
      );

      setMembers(membersWithBalance);
      setFilteredMembers(membersWithBalance);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    }
  }, []);

  // Fetch pending referral credits
  const fetchPendingCredits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPendingCredits(data || []);
    } catch (error) {
      console.error("Error fetching pending credits:", error);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchMembers();
      fetchPendingCredits();
    }
  }, [isAdmin, fetchMembers, fetchPendingCredits]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredMembers(
        members.filter(
          (m) =>
            m.full_name?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, members]);

  const selectMember = async (member: MemberWithBalance) => {
    setSelectedMember(member);
    // Fetch their transaction history
    const { data } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", member.user_id)
      .order("created_at", { ascending: false })
      .limit(20);
    setMemberTransactions(data || []);
  };

  const handleAdjust = async (isAdd: boolean) => {
    if (!selectedMember || !adjustAmount) return;
    const amount = parseInt(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setAdjusting(true);
    try {
      const { data, error } = await supabase.rpc("admin_adjust_credit", {
        p_target_user_id: selectedMember.user_id,
        p_amount: isAdd ? amount : -amount,
        p_type: "admin_adjustment",
        p_description: adjustDescription || (isAdd ? "Credit added by admin" : "Credit deducted by admin"),
      });

      if (error) throw error;

      const result = data as any;
      toast.success(`Credit ${isAdd ? "added" : "deducted"} successfully. New balance: $${result.new_balance}`);

      // Refresh
      setAdjustAmount("");
      setAdjustDescription("");
      await fetchMembers();
      
      // Refresh selected member's balance and transactions
      const updated = { ...selectedMember, balance: result.new_balance };
      setSelectedMember(updated);
      const { data: txData } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", selectedMember.user_id)
        .order("created_at", { ascending: false })
        .limit(20);
      setMemberTransactions(txData || []);
    } catch (error: any) {
      console.error("Error adjusting credit:", error);
      toast.error(error.message || "Failed to adjust credit");
    } finally {
      setAdjusting(false);
    }
  };

  const handleApproveCredit = async (txId: string) => {
    setProcessingTxId(txId);
    try {
      const { data, error } = await supabase.rpc("admin_approve_credit", { p_transaction_id: txId });
      if (error) throw error;
      toast.success("Referral credit approved!");
      await Promise.all([fetchMembers(), fetchPendingCredits()]);
      if (selectedMember) {
        const result = data as any;
        selectMember({ ...selectedMember, balance: result.new_balance || selectedMember.balance });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve");
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleRejectCredit = async (txId: string) => {
    setProcessingTxId(txId);
    try {
      const { error } = await supabase.rpc("admin_reject_credit", { p_transaction_id: txId });
      if (error) throw error;
      toast.success("Referral credit rejected");
      await fetchPendingCredits();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject");
    } finally {
      setProcessingTxId(null);
    }
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />

      <main className="relative z-10 pt-8 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/membership">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("admin.title") || "Admin - Credit Management"}
            </h1>
          </div>

          {/* Pending Referral Credits */}
          {pendingCredits.length > 0 && (
            <Card className="mobile-transparent-card border-yellow-500/30 mb-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  {t("admin.pendingReferrals") || "Pending Referrals"} ({pendingCredits.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingCredits.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{tx.full_name || tx.email || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">+${tx.amount}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-green-600 border-green-500/30 hover:bg-green-500/10"
                          disabled={processingTxId === tx.id}
                          onClick={() => handleApproveCredit(tx.id)}
                        >
                          {processingTxId === tx.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-red-600 border-red-500/30 hover:bg-red-500/10"
                          disabled={processingTxId === tx.id}
                          onClick={() => handleRejectCredit(tx.id)}
                        >
                          {processingTxId === tx.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Members List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("admin.searchMembers") || "Search members..."}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    {t("admin.noMembers") || "No members found"}
                  </p>
                ) : (
                  filteredMembers.map((member) => (
                    <button
                      key={member.user_id}
                      onClick={() => selectMember(member)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedMember?.user_id === member.user_id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {(member.full_name?.[0] || member.email?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {member.full_name || "Unnamed"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-primary">${member.balance}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Member Detail & Adjust */}
            <div className="lg:col-span-3 space-y-4">
              {!selectedMember ? (
                <Card className="mobile-transparent-card">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <User className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("admin.searchMembers") || "Select a member"}</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Member Info */}
                  <Card className="mobile-transparent-card">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={selectedMember.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {(selectedMember.full_name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">{selectedMember.full_name || "Unnamed"}</p>
                          <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                        <span className="text-sm font-medium">{t("admin.currentBalance") || "Current Balance"}</span>
                        <span className="text-2xl font-bold text-primary">${selectedMember.balance}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Adjust Form */}
                  <Card className="mobile-transparent-card">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        {t("admin.adjustCredit") || "Adjust Credit"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>{t("admin.amount") || "Amount"} (HKD)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={adjustAmount}
                          onChange={(e) => setAdjustAmount(e.target.value)}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label>{t("admin.description") || "Description"}</Label>
                        <Input
                          value={adjustDescription}
                          onChange={(e) => setAdjustDescription(e.target.value)}
                          placeholder="Reason for adjustment..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAdjust(true)}
                          disabled={adjusting || !adjustAmount}
                          className="flex-1"
                        >
                          {adjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          {t("admin.addCredit") || "Add Credit"}
                        </Button>
                        <Button
                          onClick={() => handleAdjust(false)}
                          disabled={adjusting || !adjustAmount}
                          variant="destructive"
                          className="flex-1"
                        >
                          {adjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                          {t("admin.deductCredit") || "Deduct Credit"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction History */}
                  <Card className="mobile-transparent-card">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {t("admin.creditHistory") || "Credit History"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {memberTransactions.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm py-4">
                          {t("credit.noTransactions") || "No transactions yet"}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {memberTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">
                                  {t(`credit.${tx.type}`) || tx.type}
                                  {tx.status === 'pending' && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                                      {t("credit.pending")}
                                    </span>
                                  )}
                                  {tx.status === 'rejected' && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500">
                                      {t("credit.rejected")}
                                    </span>
                                  )}
                                </p>
                                {tx.description && (
                                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {new Date(tx.created_at).toLocaleString()}
                                </p>
                              </div>
                              <span className={`text-sm font-bold ${
                                tx.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                                tx.status === 'rejected' ? 'text-muted-foreground line-through' :
                                tx.amount > 0 ? "text-green-500" : "text-red-500"
                              }`}>
                                {tx.amount > 0 ? "+" : ""}{tx.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
