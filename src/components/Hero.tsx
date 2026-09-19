import { useState } from "react";
import { VideoModal } from "./VideoModal";
import { CinematicExperience } from "./hero/CinematicExperience";
import { HeroNavigation } from "./hero/HeroNavigation";

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <HeroNavigation onBook={scrollToBooking} />
      <CinematicExperience onBook={scrollToBooking} onWatchVideo={() => setIsVideoOpen(true)} />
      <VideoModal open={isVideoOpen} onOpenChange={setIsVideoOpen} />
    </div>
  );
}