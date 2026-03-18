import { useState, useEffect } from "react";
import { Save, Loader2, User, Calendar, Award, Phone, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface MemberWithBalance {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  balance: number;
}

interface AdminMemberProfileProps {
  member: MemberWithBalance;
  onUpdated: () => void;
}

export function AdminMemberProfile({ member, onUpdated }: AdminMemberProfileProps) {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [tiers, setTiers] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    total_jumps: "0",
    tier_id: "",
    date_of_birth: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  });

  // Fetch full profile + tiers when member changes
  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, tiersRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, total_jumps, tier_id, date_of_birth, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship")
          .eq("user_id", member.user_id)
          .maybeSingle(),
        (supabase as any)
          .from("membership_tiers")
          .select("id, name, min_jumps, display_order")
          .order("display_order", { ascending: true }),
      ]);

      if (profileRes.data) {
        const p = profileRes.data;
        setProfileData({
          full_name: p.full_name || "",
          phone: p.phone || "",
          total_jumps: String(p.total_jumps || 0),
          tier_id: p.tier_id || "",
          date_of_birth: p.date_of_birth || "",
          emergency_contact_name: p.emergency_contact_name || "",
          emergency_contact_phone: p.emergency_contact_phone || "",
          emergency_contact_relationship: p.emergency_contact_relationship || "",
        });
      }

      if (tiersRes.data) {
        setTiers(tiersRes.data);
      }
    };
    fetchData();
  }, [member.user_id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const totalJumps = parseInt(profileData.total_jumps);
      if (isNaN(totalJumps) || totalJumps < 0) {
        toast.error("Invalid jump count");
        setSaving(false);
        return;
      }

      const { data, error } = await supabase.rpc("admin_update_profile" as any, {
        p_target_user_id: member.user_id,
        p_full_name: profileData.full_name || null,
        p_phone: profileData.phone || null,
        p_total_jumps: totalJumps,
        p_tier_id: profileData.tier_id || null,
        p_date_of_birth: profileData.date_of_birth || null,
        p_emergency_contact_name: profileData.emergency_contact_name || null,
        p_emergency_contact_phone: profileData.emergency_contact_phone || null,
        p_emergency_contact_relationship: profileData.emergency_contact_relationship || null,
      });

      if (error) throw error;

      toast.success(t("admin.profileUpdated") || "Member profile updated");
      onUpdated();
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mobile-transparent-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4" />
          {t("admin.editProfile") || "Edit Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>{t("profile.fullName") || "Full Name"}</Label>
            <Input
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Full Name"
            />
          </div>
          <div>
            <Label>{t("profile.phone") || "Phone"}</Label>
            <Input
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+852 1234 5678"
            />
          </div>
        </div>

        {/* Loyalty Info */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              {t("admin.totalJumps") || "Total Jumps"}
            </Label>
            <Input
              type="number"
              min="0"
              value={profileData.total_jumps}
              onChange={(e) => setProfileData(prev => ({ ...prev, total_jumps: e.target.value }))}
            />
          </div>
          <div>
            <Label>{t("admin.memberTier") || "Membership Tier"}</Label>
            <Select
              value={profileData.tier_id}
              onValueChange={(val) => setProfileData(prev => ({ ...prev, tier_id: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {tiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name} ({tier.min_jumps}+ jumps)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t("admin.dateOfBirth") || "Date of Birth"}
            </Label>
            <Input
              type="date"
              value={profileData.date_of_birth}
              onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1 text-muted-foreground">
            <UserPlus className="w-3 h-3" />
            {t("profile.emergencyContact") || "Emergency Contact"}
          </Label>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              value={profileData.emergency_contact_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
              placeholder={t("profile.name") || "Name"}
            />
            <Input
              value={profileData.emergency_contact_phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
              placeholder={t("profile.phone") || "Phone"}
            />
            <Input
              value={profileData.emergency_contact_relationship}
              onChange={(e) => setProfileData(prev => ({ ...prev, emergency_contact_relationship: e.target.value }))}
              placeholder={t("profile.relationship") || "Relationship"}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {t("admin.saveChanges") || "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
