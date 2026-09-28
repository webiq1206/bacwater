import { convertMassText, type MassUnit } from '@/lib/calc/mass-text';

(() => {
    if (customElements.get('bacwater-mass-converter')) return;
    const convert = convertMassText;
    class BacwaterMassConverter extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        const root = this.attachShadow({mode:'open'});
        root.innerHTML = `<style>
          :host{display:block;max-width:640px;font:16px/1.6 system-ui,sans-serif;color:#18382d;color-scheme:light}
          *{box-sizing:border-box}.card{border:1px solid #c9d6c1;border-radius:20px;padding:clamp(16px,4vw,28px);background:#f7f8f2}
          .brand{font-size:13px;letter-spacing:.06em;font-weight:650}h2{font:500 28px/1.2 Georgia,serif;margin:14px 0 10px}
          p{margin:10px 0}.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px;margin:22px 0}
          label{display:block;font-size:14px;font-weight:600}input{display:block;width:100%;min-width:0;font:inherit;margin-top:7px;padding:12px;border:1px solid #81907b;border-radius:10px;color:#18382d;background:white}
          input[aria-invalid=true]{border-color:#9e3030}output{display:block;background:#eaf0dd;border-radius:12px;padding:16px;overflow-wrap:anywhere}
          .small{font-size:13px;color:#455744}.links{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:16px}
          a{color:#18382d}a,button{min-height:44px;display:inline-flex;align-items:center}button{font:inherit;border:1px solid #81907b;padding:8px 14px;border-radius:8px;background:white;cursor:pointer}
          :is(a,button,input):focus-visible{outline:3px solid #38694c;outline-offset:3px}
        </style><section class="card" aria-label="BACwater.ai mass converter">
          <div class="brand">BACwater.ai / FREE TOOL</div><h2>mg to mcg converter</h2>
          <p>1 mg = 1,000 mcg. Enter a value in either field.</p>
          <div class="fields"><label>Milligrams (mg)<input id="mg" inputmode="decimal" type="text" autocomplete="off" maxlength="64" aria-describedby="result"/></label><label>Micrograms (mcg)<input id="mcg" inputmode="decimal" type="text" autocomplete="off" maxlength="64" aria-describedby="result"/></label></div>
          <output id="result" aria-live="polite" aria-atomic="true">Enter a mass to check the conversion.</output>
          <p class="small">Mass conversion only. This does not select an amount to take or convert mass to liquid volume.</p>
          <div class="links"><button type="button">Clear</button><a href="https://bacwater.ai/tools/mg-to-mcg?utm_source=embed&amp;utm_medium=referral&amp;utm_campaign=free_calculators" target="_blank" rel="noopener noreferrer">Open full converter</a><a href="https://bacwater.ai/methodology" target="_blank" rel="noopener noreferrer">Formulas &amp; limits</a></div>
          <p class="small">No account, cookies or input collection by this widget. <a href="https://bacwater.ai/share-tools" target="_blank" rel="noopener noreferrer">Get this free tool</a></p>
        </section>`;
        const mg = root.getElementById('mg') as HTMLInputElement, mcg = root.getElementById('mcg') as HTMLInputElement, status = root.getElementById('result')!;
        const update = (input: HTMLInputElement, unit: MassUnit, other: HTMLInputElement) => {
          const result = convert(input.value, unit);
          mg.removeAttribute('aria-invalid'); mcg.removeAttribute('aria-invalid');
          other.value = result.kind === 'value' ? result[unit === 'mg' ? 'mcg' : 'mg'] : '';
          if (result.kind === 'error') input.setAttribute('aria-invalid','true');
          status.textContent = result.kind === 'value' ? result.mg + ' mg = ' + result.mcg + ' mcg' : result.kind === 'error' ? result.message : 'Enter a mass to check the conversion.';
        };
        mg.addEventListener('input', () => update(mg, 'mg', mcg));
        mcg.addEventListener('input', () => update(mcg, 'mcg', mg));
        root.querySelector('button')!.addEventListener('click', () => { mg.value=''; mcg.value=''; update(mg,'mg',mcg); mg.focus(); });
      }
    }
    customElements.define('bacwater-mass-converter', BacwaterMassConverter);
  })();
