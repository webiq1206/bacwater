"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Calculator, HelpCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnalyticsPreferences } from "@/components/common/analytics-preferences";
import { SiteSearchButton } from "@/components/search/site-search";
import { SupplierWaterLink } from "@/components/partners/supplier-context";
import { CalculatorProductTools, ProductSelectionContext } from "@/components/partners/calculator-products";
import { productForCalculatorPath } from "@/lib/partners/supplier-catalog";
import { useCalculationSession, resumeMassCalculation, chooseCalculationProduct } from "@/lib/session/calculation-session";
import styles from "./calculator-workspace.module.css";
const ActionsContext = createContext<HTMLElement | null>(null);
export function WorkspaceActions({ children }: { children: ReactNode }) {
  const destination = useContext(ActionsContext);
  const controls = <div className={styles.actions}>{children}</div>;
  return destination ? createPortal(controls, destination) : controls;
}
/** A page, not a modal: ordinary Back/Forward and deep links remain intact. */
export function CalculatorWorkspace({ title, description, children, help, reference, backHref = "/tools" }: {
  title: string; description: string; children: ReactNode; help?: ReactNode; reference?: ReactNode; backHref?: string;
}) {
  const [actionsRoot, setActionsRoot] = useState<HTMLDivElement | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const root = useRef<HTMLElement>(null), bar = useRef<HTMLElement>(null), guide = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const session=useCalculationSession();
  const routeProduct=productForCalculatorPath(pathname||"");
  useEffect(()=>{
    if(routeProduct)chooseCalculationProduct(routeProduct.id,routeProduct.kind,routeProduct.reference||"");
    else if(pathname==="/calculate/hcg")chooseCalculationProduct("hcg","iu","hcg");
    else if(/^\/tools\/(bac-water|reverse-bac|supplies|dose)$/.test(pathname||""))resumeMassCalculation();
  },[pathname,routeProduct]);
  const hasOwnProductPicker = ["/peptide-calculator", "/plan", "/plan/new"].includes(pathname || "") || /^\/plan\/[^/]+\/edit$/.test(pathname || "");
  const [selectedProduct,setSelectedProduct]=useState<string|null>(()=>productForCalculatorPath(pathname||"")?.id||null);
  useEffect(()=>{const product=productForCalculatorPath(pathname||"");if(product)setSelectedProduct(product.id);},[pathname]);
  useEffect(() => { setHelpOpen(false); }, [pathname]);
  useEffect(() => {
    // Keyboard height can change the visual viewport without changing CSS vh.
    // Never counteract pinch zoom: keep zoom and panning under browser control.
    const viewport = window.visualViewport;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = root.current; if (!el) return;
        if (bar.current) el.style.setProperty("--calc-bar-height", `${bar.current.getBoundingClientRect().bottom - el.getBoundingClientRect().top}px`);
        if (viewport && Math.abs(viewport.scale - 1) < 0.02) {
          el.style.setProperty("--calc-height", `${viewport.height}px`);
          el.style.setProperty("--calc-top", `${viewport.offsetTop}px`);
        } else {
          el.style.removeProperty("--calc-height");
          el.style.removeProperty("--calc-top");
        }
      });
    };
    const barObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (bar.current) barObserver?.observe(bar.current);
    update(); viewport?.addEventListener("resize", update); viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(raf); barObserver?.disconnect(); viewport?.removeEventListener("resize", update); viewport?.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  function closeHelp() {
    setHelpOpen(false);
    guide.current?.querySelector("summary")?.focus();
  }
  return <ActionsContext.Provider value={actionsRoot}><ProductSelectionContext.Provider value={setSelectedProduct}>
    <section ref={root} className={styles.workspace} data-calculator-workspace data-help-open={helpOpen} aria-label={title} onKeyDown={event => { if (event.key === "Escape" && helpOpen && !event.defaultPrevented && !(event.target instanceof Element && event.target.closest('[role="dialog"]'))) { event.preventDefault(); closeHelp(); } }}>
      <header ref={bar} className={styles.bar}>
        <Link href={backHref} className={styles.back} aria-label={backHref === "/" ? "Back to website" : backHref.startsWith("/peptides/") ? "Back to compound reference" : backHref.startsWith("/plan/") ? "Back to saved calculation" : "Back to calculators"}><ArrowLeft size={19} aria-hidden="true"/><span>Back</span></Link>
        <Link href="/tools" className={styles.brand} aria-label="Choose a calculator"><Calculator size={20} aria-hidden="true"/><span>Calculator</span></Link>
        <div className={styles.headerActions}><SiteSearchButton/>
        <details ref={guide} className={styles.guide} open={helpOpen}>
          <summary onClick={event => { event.preventDefault(); setHelpOpen(open => !open); }} aria-label={helpOpen ? "Close calculator help" : "Open calculator help"}><HelpCircle size={19} aria-hidden="true"/><span>Help</span></summary>
          <div className={styles.helpBody} role="region" aria-label="Calculator help and supplies" tabIndex={0}>
            <div className={styles.helpHeading}><h2>Help &amp; supplies</h2><button type="button" onClick={closeHelp} aria-label="Return to calculation"><X size={21} aria-hidden="true"/></button></div>
            <p>Use the numbers from your label and instructions. We check the math. We do not tell you what to take or what to mix.</p>
            <div className={styles.water}><p><strong>Looking for BAC water?</strong></p><SupplierWaterLink/><p>Check the product instructions first. A link is not advice to use it.</p></div>
            {help}
            <p className={styles.helpLinks}><Link href="/methodology">How the math works</Link><Link href="/contact">Report a problem</Link><Link href="/privacy">Privacy</Link></p>
            <AnalyticsPreferences />
            <button type="button" className={styles.returnButton} onClick={closeHelp}>Back to my calculation</button>
          </div>
        </details></div>
      </header>
      <div className={styles.body} data-calculator-scroll tabIndex={0} role="region" aria-label="Calculation workspace">
        <div className={styles.content}>
          <div className={styles.heading}><h1>{title}</h1><p>{description}</p></div>
          {!hasOwnProductPicker && <CalculatorProductTools selectedId={routeProduct?.id||(session.kind==="single"?session.productId:null)}/>}
          {children}
          {reference && <div className="mt-10 border-t border-border pb-8 text-base leading-relaxed" data-calculator-reference>{reference}</div>}
        </div>
      </div>
      <div ref={setActionsRoot} className={styles.actionDock} data-calculator-actions />
    </section>
  </ProductSelectionContext.Provider></ActionsContext.Provider>;
}
