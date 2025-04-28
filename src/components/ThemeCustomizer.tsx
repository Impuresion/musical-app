
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { 
  initializeThemeColors, 
  initializeSunriseGradient 
} from "@/utils/themeUtils";

export function ThemeCustomizer() {
  const [accentHue, setAccentHue] = useState(() => {
    return Number(localStorage.getItem("theme-accent-hue") || "271");
  });

  const updateThemeColors = (accentH: number) => {
    // Always use dark theme
    initializeThemeColors(accentH, true);
    initializeSunriseGradient(accentH, 100, true); // Fixed opacity at 100
    
    localStorage.setItem("theme-accent-hue", accentH.toString());
  };

  useEffect(() => {
    updateThemeColors(accentHue);
  }, [accentHue]);

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Accent Color</Label>
        <Slider
          value={[accentHue]}
          max={360}
          step={1}
          onValueChange={(value) => {
            const newHue = value[0];
            setAccentHue(newHue);
            updateThemeColors(newHue);
          }}
          className="[&_[role=slider]]:bg-primary"
        />
      </div>
    </div>
  );
}
