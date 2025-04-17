
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function HeaderMenu() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoZoom, setAutoZoom] = useState(true);
  const [loopImages, setLoopImages] = useState(true);
  const [showFilenames, setShowFilenames] = useState(true);

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className="text-white hover:bg-white/10"
        >
          <Settings size={18} />
          <span className="sr-only">Settings</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHelp(true)}
          className="text-white hover:bg-white/10"
        >
          <HelpCircle size={18} />
          <span className="sr-only">Help</span>
        </Button>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Viewer Settings</DialogTitle>
            <DialogDescription>
              Customize how the image viewer works
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-zoom" className="flex flex-col gap-1">
                <span>Auto-fit images</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Automatically zoom to fit image to screen
                </span>
              </Label>
              <Switch
                id="auto-zoom"
                checked={autoZoom}
                onCheckedChange={setAutoZoom}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="loop-images" className="flex flex-col gap-1">
                <span>Loop through images</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Circle back to first image after last
                </span>
              </Label>
              <Switch
                id="loop-images"
                checked={loopImages}
                onCheckedChange={setLoopImages}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-filenames" className="flex flex-col gap-1">
                <span>Show filenames</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Display image filenames in viewer
                </span>
              </Label>
              <Switch
                id="show-filenames"
                checked={showFilenames}
                onCheckedChange={setShowFilenames}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>How to Use Image Viewer</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(false)}
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-muted rounded-full p-1">→</span>
                  <span>Use arrow keys or swipe to navigate between images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-muted rounded-full p-1">🖱️</span>
                  <span>Click and drag left/right to navigate between images</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Zoom Controls</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-muted rounded-full p-1">⚙️</span>
                  <span>Use mouse wheel to zoom in and out</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-muted rounded-full p-1">👆</span>
                  <span>Pinch to zoom on touch devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-muted rounded-full p-1">🔄</span>
                  <span>Press ESC key or click Reset button to reset zoom</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Other Controls</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-muted rounded-full p-1">💾</span>
                  <span>Click Download button to save current image</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
