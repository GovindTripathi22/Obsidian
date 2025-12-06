import { Button } from "@/components/ui/button";
import { Laptop, Smartphone, Tablet, Code, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewCanvasProps {
  htmlCode: string;
}

export function PreviewCanvas({ htmlCode }: PreviewCanvasProps) {
  const [width, setWidth] = useState<"100%" | "768px" | "375px">("100%");

  // Inject script for interaction
  const scriptContent = `
    <script>
      let selectedElement = null;

      // Capture phase: Only stop LINKS
      window.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Link navigation blocked");
        }
      }, true);

      document.body.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        if (selectedElement) return;
        e.target.style.outline = '2px dashed #3b82f6';
        e.target.style.cursor = 'pointer';
      });

      document.body.addEventListener('mouseout', (e) => {
        e.stopPropagation();
        if (e.target === selectedElement) return;
        e.target.style.outline = '';
      });

      document.body.addEventListener('click', (e) => {
        // Allow default behavior (focus) for editable elements
        // Only prevent default if it's NOT editable yet
        if (e.target.isContentEditable) {
            return; 
        }
        
        e.stopPropagation();
        
        // Deselect previous
        if (selectedElement && selectedElement !== e.target) {
            selectedElement.style.outline = '';
            selectedElement.contentEditable = 'false';
        }
        
        selectedElement = e.target;
        selectedElement.style.outline = '2px solid #3b82f6';
        selectedElement.contentEditable = 'true';
        selectedElement.focus();
        
        // Sync changes back to parent
        selectedElement.oninput = function() {
            window.parent.postMessage({
                type: 'ELEMENT_UPDATED',
                payload: {
                    id: selectedElement.id,
                    content: selectedElement.innerText
                }
            }, '*');
        };

        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          payload: {
            tagName: selectedElement.tagName,
            textContent: selectedElement.innerText,
            classes: selectedElement.className,
            id: selectedElement.id || (selectedElement.id = 'el-' + Math.random().toString(36).substr(2, 9)),
            attributes: {
                src: selectedElement.getAttribute('src'),
                alt: selectedElement.getAttribute('alt'),
                href: selectedElement.getAttribute('href')
            }
          }
        }, '*');
      });

      window.addEventListener('message', (event) => {
        if (event.data.type === 'UPDATE_ELEMENT') {
          const { id, styles, content, classes, attributes } = event.data.payload;
          const el = document.getElementById(id);
          if (el) {
            if (content !== undefined) el.innerText = content; // Use innerText
            if (classes !== undefined) el.className = classes;
            if (styles) {
                try {
                    const styleObj = JSON.parse(styles);
                    Object.assign(el.style, styleObj);
                } catch(e) {}
            }
            if (attributes) {
                Object.keys(attributes).forEach(key => {
                    el.setAttribute(key, attributes[key]);
                });
            }
          }
        }
        if (event.data.type === 'REQUEST_HTML') {
            const clone = document.documentElement.cloneNode(true);
            const scripts = clone.querySelectorAll('script');
            scripts.forEach(s => {
                if (s.textContent && s.textContent.includes('selectedElement')) s.remove();
            });
            const elements = clone.querySelectorAll('*');
            elements.forEach((el) => {
                el.style.outline = '';
                el.style.cursor = '';
                el.contentEditable = 'false'; // Clean up
            });
            window.parent.postMessage({
                type: 'HTML_RESPONSE',
                payload: clone.outerHTML
            }, '*');
        }
      });
    </script>
  `;

  // Robust injection: try replacing </body>, otherwise append to end
  const injectedCode = htmlCode
    ? (() => {
      let code = htmlCode;

      // Ensure Tailwind CDN
      if (!code.includes("cdn.tailwindcss.com")) {
        const headEnd = code.indexOf("</head>");
        const tailwindScript = `<script src="https://cdn.tailwindcss.com"></script>\n<script>tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] } } } }</script>`;
        if (headEnd !== -1) {
          code = code.replace("</head>", tailwindScript + "</head>");
        } else if (code.includes("<html")) {
          code = code.replace("<html>", "<html><head>" + tailwindScript + "</head>");
        } else {
          code = "<head>" + tailwindScript + "</head>" + code;
        }
      }

      // Ensure Inter Font
      if (!code.includes("family=Inter")) {
        const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
        const headEnd = code.indexOf("</head>");
        if (headEnd !== -1) {
          code = code.replace("</head>", fontLink + "</head>");
        }
      }

      // Inject our interaction script
      return code.includes("</body>")
        ? code.replace("</body>", scriptContent + "</body>")
        : code + scriptContent;
    })()
    : "";

  const srcDoc = injectedCode || "<html><body style='background:black;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;'><h1>Preview Area</h1><p style='color:#888;margin-top:10px'>Enter a prompt to generate...</p></body></html>";

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col h-full bg-transparent relative">
      {/* Grid Background (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md p-4 z-10">
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWidth("100%")}
            className={`h-8 w-8 rounded-md transition-all ${width === "100%" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-white hover:bg-white/10"}`}
          >
            <Laptop className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWidth("768px")}
            className={`h-8 w-8 rounded-md transition-all ${width === "768px" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-white hover:bg-white/10"}`}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWidth("375px")}
            className={`h-8 w-8 rounded-md transition-all ${width === "375px" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-white hover:bg-white/10"}`}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline font-mono text-xs">VIEW CODE</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-zinc-950/95 border-zinc-800 text-white backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>Generated Code</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[600px] w-full rounded-xl border border-white/10 bg-black/50 p-6">
                <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap font-ligatures-none">
                  {htmlCode || "No code generated yet."}
                </pre>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            onClick={handleDownload}
            className="h-9 gap-2 bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
            disabled={!htmlCode}
          >
            <Download className="h-4 w-4" />
            <span className="font-bold text-xs tracking-wide">EXPORT</span>
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden flex justify-center items-center relative z-0 p-6">
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] shadow-2xl overflow-hidden bg-white relative group"
          style={{
            width: width,
            height: width === "100%" ? "100%" : "95%",
            borderRadius: width === "100%" ? "0" : "12px",
            boxShadow: width === "100%" ? "none" : "0 0 100px -20px rgba(0,0,0,0.7)"
          }}
        >
          {/* Browser Bar for non-full width */}
          {width !== "100%" && (
            <div className="h-8 bg-[#f1f1f1] border-b border-[#d1d1d1] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-5 w-1/2 bg-white rounded-md border border-[#d1d1d1] shadow-sm flex items-center justify-center">
                  <span className="text-[10px] text-zinc-400 font-medium">obsidian-preview.app</span>
                </div>
              </div>
            </div>
          )}
          <iframe
            srcDoc={srcDoc}
            className="h-full w-full border-0 bg-white"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
