/** Research mechanisms reviewed September 25, 2026.
 * Partner names are identifiers, not evidence of product quality or efficacy.
 * Mechanisms describe the cited molecule/model; uncertain and retracted evidence stays explicit.
 */
export interface ProductResearch {
  name: string;
  aliases: readonly string[];
  summary: string;
  what: string;
  study: string;
  /** Two short paragraphs: target/action, then consequence and evidence boundary. */
  how: string;
  limit: string;
  sources: readonly { label: string; url: string; type: "product" | "paper" | "reference"; note?: string }[];
}
export const PRODUCT_RESEARCH: Readonly<Record<string, ProductResearch>> = {
  "amino-h2o": {
    "name": "Amino H2O",
    "aliases": ["BAC water", "bacteriostatic water", "H2O"],
    "summary": "Lab water with a preservative that slows bacterial growth.",
    "what": "Amino H2O is water with 0.9% benzyl alcohol, a preservative. It is a lab supply, not a peptide.",
    "study": "This is a lab supply rather than an active research peptide. Labs use a compatible liquid to hold a measured amount of a compound in an even solution.",
    "how": "Water molecules surround and separate parts of a compound that can dissolve in water. That lets the material spread through the liquid instead of remaining a dry powder. Whether a particular compound dissolves and stays intact depends on its chemistry.\n\nThe added benzyl alcohol is a preservative that slows bacterial growth in the liquid. It is not a filter, does not remove toxins, and does not turn contaminated material into a sterile sample. Water and preservative do different jobs: one holds the sample; the other limits microbial growth.",
    "limit": "The preservative does not prove sterility or compatibility. Use the supplier label and an appropriate laboratory protocol to establish those separately.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/amino-h2o", "type": "product"}
    ]
  },
  "glp-1": {
    "name": "GLP-1 (SM)",
    "aliases": ["Semaglutide", "SM", "glp1"],
    "summary": "A peptide studied in insulin release and food-intake signals.",
    "what": "GLP-1 (SM) is a lab-made peptide. A peptide is a chain of small building blocks called amino acids.",
    "study": "Researchers examine how the GLP-1 pathway links a rise in glucose with insulin release. Other experiments track how this pathway affects the nerve signals that govern food intake.",
    "how": "GLP-1 is a natural message released after food reaches the gut. The compound behind GLP-1 (SM) is designed to mimic that message. It attaches to the GLP-1 receptor, a receiving point on a cell. In insulin-making pancreas cells, that signal helps release insulin when glucose, a form of sugar, is high.\n\nGLP-1 receptors also take part in the nerve network that controls food intake. Scientists study those separate effects rather than treating them as one process. Changes to this peptide's structure make it resist one normal breakdown enzyme and bind to albumin, a carrier protein. That design is not proof of this product's performance.",
    "limit": "These are compound-level mechanisms. They do not establish the safety, effectiveness or identity of a purchased research vial.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/glp-1", "type": "product"},
      {"label": "Semaglutide molecular design and receptor research", "url": "https://pubmed.ncbi.nlm.nih.gov/26308095/", "type": "paper"}
    ]
  },
  "glp-2": {
    "name": "GLP-2 (TR)",
    "aliases": ["Tirzepatide", "TR", "glp2"],
    "summary": "A peptide studied across two insulin and food-signal pathways.",
    "what": "GLP-2 (TR) is a lab-made peptide with 39 amino-acid building blocks.",
    "study": "Researchers compare how the GIP and GLP-1 pathways affect insulin release, glucose handling and food intake. The goal is to understand what each pathway contributes when a single molecule reaches both.",
    "how": "GIP and GLP-1 are two natural messages linked to food intake. The compound behind GLP-2 (TR) can activate the receiving point for either message. In pancreas cells, both pathways can increase the signal that releases insulin when glucose is present. Insulin is the hormone that helps move glucose out of the blood.\n\nThe same receptor families also have roles outside the pancreas, including nerve and fat-tissue signals. Researchers use receptor tests and animal experiments to separate these effects. Acting at two targets does not mean each target acts equally, or that results from the two pathways simply add together.",
    "limit": "GLP-2 (TR) is the partner’s product name, not the natural GLP-2 hormone. Research on the compound does not validate this supplier’s product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/glp-2", "type": "product"},
      {"label": "Tirzepatide discovery: receptor, cell and animal experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/30473097/", "type": "paper"},
      {"label": "Different GIP and GLP-1 receptor responses", "url": "https://pubmed.ncbi.nlm.nih.gov/32730231/", "type": "paper"}
    ]
  },
  "glp-3": {
    "name": "GLP-3 (RT)",
    "aliases": ["Retatrutide", "RT", "LY3437943", "glp3"],
    "summary": "A peptide studied in insulin, food-intake and fuel-use pathways.",
    "what": "GLP-3 (RT) is a lab-made peptide with 39 amino-acid building blocks.",
    "study": "Research asks how three hormone pathways work together to change food intake and the way fuel is used. Experiments separate insulin release, liver glucose output and energy use instead of calling them all the same effect.",
    "how": "The compound behind GLP-3 (RT) activates three receiving points on cells: GIP, GLP-1 and glucagon receptors. GIP and GLP-1 are part of the after-food message system. In pancreas cells, they help link rising glucose to insulin release. GLP-1 signaling also reaches nerve circuits that control food intake.\n\nGlucagon has a different job. Its liver signal can release stored glucose, and researchers also study its role in energy use. Animal experiments test whether combining these pathways changes both food intake and fuel use. The three targets do not all lower glucose, and their balance cannot be predicted just by counting receptors.",
    "limit": "These explanations describe research on the compound, not three proven benefits of the product. Findings in one experimental model may not carry over to another.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/glp-3", "type": "product"},
      {"label": "Retatrutide discovery and three-pathway experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/35985340/", "type": "paper"},
      {"label": "How retatrutide binds its three targets", "url": "https://www.nature.com/articles/s41421-024-00700-0", "type": "paper"}
    ]
  },
  "bpc-157": {
    "name": "BPC-157",
    "aliases": ["bpc157"],
    "summary": "A peptide studied in how cells grip, move and respond to damage.",
    "what": "BPC-157 is a lab-made chain of 15 amino acids, the small building blocks of peptides.",
    "study": "Researchers test whether BPC-157 changes the steps cells use to move into a damaged area. They measure cell movement, attachment and survival, rather than assuming that a change in one signal means tissue has been repaired.",
    "how": "For a cell to move, it must grip the surface around it, pull itself forward and let go at the back. In cultured rat tendon cells, BPC-157 was linked to changes in FAK and paxillin, two proteins involved in those grip points. The cells moved more readily in that experiment.\n\nThat offers one possible explanation for why BPC-157 is studied in tissue-damage models: it may affect the machinery cells use to reach and organize an area. It does not show that the peptide directly rebuilds tissue. Its first binding target and the complete chain of events are still not firmly established.",
    "limit": "A cell-movement result is not proof of injury repair. The cited experiment used cultured rat cells, not a test of this merchant’s vial.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/bpc-157", "type": "product"},
      {"label": "BPC-157: tendon-cell movement and attachment proteins", "url": "https://pubmed.ncbi.nlm.nih.gov/21030672/", "type": "paper"},
      {"label": "BPC-157 experimental ligament model", "url": "https://pubmed.ncbi.nlm.nih.gov/20225319/", "type": "paper"}
    ]
  },
  "ghk-cu": {
    "name": "GHK-Cu",
    "aliases": ["ghkcu"],
    "summary": "A copper-binding peptide studied in the material around cells.",
    "what": "GHK-Cu is a chain of three amino acids joined to copper. The letters name the three building blocks; Cu means copper.",
    "study": "Research focuses on the production and breakdown of collagen and other materials that support cells. Collagen is a strong, fiber-forming protein, not a substance that this peptide simply adds to a sample.",
    "how": "GHK is a short chain that grips a copper ion, a charged copper atom. Copper can help enzymes carry out chemical reactions, but its binding and release must be controlled. GHK-Cu is studied as a copper-containing signal within the network that manages the material around cells.\n\nIn experimental tissue models, researchers measured changes in collagen production and in the surrounding support material after exposure to GHK-Cu. Think of this as studying the cells that build and remodel a scaffold, not using the peptide as replacement scaffolding. Copper binding is established; the many downstream effects depend on the model and are not one fully mapped pathway.",
    "limit": "The tissue experiments do not establish skin, hair or other cosmetic benefits for this research product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/ghk-cu", "type": "product"},
      {"label": "GHK-Cu and connective-tissue production in an experimental model", "url": "https://pubmed.ncbi.nlm.nih.gov/8227353/", "type": "paper"}
    ]
  },
  "tb-500": {
    "name": "TB-500",
    "aliases": ["tb500", "thymosin beta 4"],
    "summary": "A thymosin-related product studied in the machinery of cell movement.",
    "what": "TB-500 is a name used for peptide products related to thymosin beta-4. The exact amino-acid chain matters.",
    "study": "Related research examines how cells change shape and move. A central question is how actin, a protein that forms movable fibers inside cells, is kept ready for that work.",
    "how": "Actin is part of a cell's internal frame. Small actin units join into fibers that help a cell push forward and change shape. Full-length thymosin beta-4 binds loose actin units and helps control the supply available to build those fibers. Researchers study that process in cell movement and tissue-response models.\n\nThe important distinction is the molecule itself: TB-500 is a commercial name used for related peptides, including shorter fragments. A fragment can lose parts needed for the full molecule's behavior. The actin explanation applies to full thymosin beta-4 research; it must not be treated as a proven mechanism for every product called TB-500.",
    "limit": "Confirm the exact sequence. Evidence for full thymosin beta-4 or one form of its fragments does not automatically apply to another.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/tb-500", "type": "product"},
      {"label": "Full thymosin beta-4: cell movement and tissue research", "url": "https://pubmed.ncbi.nlm.nih.gov/10469335/", "type": "paper", "note": "This paper concerns full thymosin beta-4, not proof that every TB-500 product is the same molecule."}
    ]
  },
  "tesamorlin": {
    "name": "Tesamorlin",
    "aliases": ["Tesamorelin", "TES"],
    "summary": "A GHRH-like peptide studied in pituitary growth-hormone release.",
    "what": "Tesamorlin is the partner’s name for a lab-made peptide modeled on growth hormone-releasing hormone, often shortened to GHRH.",
    "study": "Researchers study how a GHRH-like signal changes the release pattern of growth hormone from the pituitary gland. The question concerns the gland’s response, not direct delivery of growth hormone.",
    "how": "The pituitary is a small gland that releases hormones. One of its receiving points responds to GHRH, the natural message that calls for growth hormone release. The compound described by the partner as Tesamorlin copies that message and activates the GHRH receptor. This starts the cell process that releases stored growth hormone.\n\nIt is therefore different from growth hormone itself: it is a signal to release it, not a replacement supply. Its modified end is designed to resist breakdown compared with natural GHRH. Experiments examine the timing and size of the gland's response; they do not establish a predictable outcome from this research product.",
    "limit": "The partner spells the product Tesamorlin. Compound studies of tesamorelin do not establish a hormonal benefit, quality or safety for this vial.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/tesamorlin", "type": "product"},
      {"label": "Tesamorelin and patterns of pituitary hormone release", "url": "https://pubmed.ncbi.nlm.nih.gov/21531600/", "type": "paper"}
    ]
  },
  "mots-c": {
    "name": "MOTS-C",
    "aliases": ["motsc"],
    "summary": "A peptide studied in the cell’s fuel-sensing system.",
    "what": "MOTS-C is a 16-part peptide linked to mitochondria, the tiny structures that help cells release energy from fuel.",
    "study": "Scientists examine whether MOTS-C changes how stressed cells use glucose and other fuel. They measure chemical intermediates and energy-sensing proteins to understand the route, not just the final result.",
    "how": "MOTS-C is linked to mitochondria, the structures that help cells process fuel. In the original cell experiments, it changed a pathway that helps make DNA building blocks. A chemical called AICAR then built up. AICAR can activate AMPK, a protein that senses when a cell needs to adjust its fuel use.\n\nAMPK works more like a fuel-budget switch than an energy source. It can shift cells toward using fuel and away from some energy-consuming building tasks. Researchers study glucose handling and stress responses along this route. MOTS-C is not itself cellular fuel, and a change in this pathway is not proof of increased personal energy.",
    "limit": "The pathway was studied in cells and animals. It does not establish exercise, energy or weight-related benefits from the merchant’s product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/mots-c", "type": "product"},
      {"label": "MOTS-c: AICAR, AMPK and cell-fuel experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/25738459/", "type": "paper"}
    ]
  },
  "nad-plus": {
    "name": "NAD+",
    "aliases": ["NAD", "nicotinamide adenine dinucleotide"],
    "summary": "A molecule that carries electrons between cell reactions.",
    "what": "NAD+ is a small molecule found in cells. It helps enzymes, the tiny workers that carry out chemical reactions. It is not a peptide.",
    "study": "Labs study how NAD+ supports fuel-processing reactions and enzymes that modify proteins. These are two different jobs, even though both depend on the same molecule being available inside a cell.",
    "how": "Think of NAD+ as an empty carrier. During fuel breakdown, it accepts electrons, tiny charged particles, and becomes NADH. NADH can pass those electrons to other reactions and become NAD+ again. This recycling helps cells keep their fuel-processing chemistry running; NAD+ is not energy that can simply be poured into a cell.\n\nA separate group of enzymes uses up NAD+ as part of its work. For example, sirtuins use it when removing small chemical tags from proteins. Researchers study both the carrier cycle and these enzyme reactions. A bottle containing NAD+ does not demonstrate that intact NAD+ enters cells or changes either process.",
    "limit": "NAD+ is not a peptide. Its established roles inside cells do not prove delivery into cells, a health benefit or an outcome from this product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/nad-plus", "type": "product"},
      {"label": "NAD+/NADH chemistry reference", "url": "https://pubchem.ncbi.nlm.nih.gov/compound/5892", "type": "reference", "note": "Official chemical reference for the electron-carrier cycle, not a study of this product."},
      {"label": "NAD-dependent protein-tag removal by Sir2 enzymes", "url": "https://pubmed.ncbi.nlm.nih.gov/10693811/", "type": "paper"}
    ]
  },
  "cjc-ipa-no-dac": {
    "name": "CJC-1295 / Ipamorelin (No DAC)",
    "aliases": ["CJC IPA", "CJC1295 Ipamorelin"],
    "summary": "Two peptides studied at different growth-hormone release receptors.",
    "what": "This product combines CJC-1295 without DAC and Ipamorelin. DAC is an added chemical group used in a different form of CJC-1295.",
    "study": "The research question is whether two different signals change pituitary hormone release when studied together. Evidence for each ingredient is not the same as evidence for the exact blend.",
    "how": "The CJC component is modeled on GHRH, a message to the pituitary gland to release growth hormone. Ipamorelin reaches a different receiving point, the ghrelin receptor, which can also trigger release. These are two routes into the same hormone-release system, rather than two supplies of growth hormone.\n\nResearchers can compare the separate signals with a mixture to test how the routes interact. The response need not be simply additive. No DAC means this product lacks the albumin-binding chemical group used in another form of CJC-1295. Results about that longer-acting form must not be borrowed to describe the no-DAC blend.",
    "limit": "The two ingredients, their amounts and the No DAC form matter. Separate-compound research does not prove synergy or a hormonal result for the blend.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/cjc-ipa-no-dac", "type": "product"},
      {"label": "CJC-1295 albumin-binding design", "url": "https://pubmed.ncbi.nlm.nih.gov/15817669/", "type": "paper", "note": "Studies the albumin-linked design. This does not establish duration or behavior of the No DAC product."},
      {"label": "Ipamorelin: pituitary-cell receptor experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/9849822/", "type": "paper"}
    ]
  },
  "kpv": {
    "name": "KPV",
    "aliases": [],
    "summary": "A short peptide studied in cells’ inflammatory alarm system.",
    "what": "KPV is a very short peptide made from three amino acids: lysine, proline and valine.",
    "study": "Cell experiments ask whether KPV reduces the messages that keep an inflammatory response active. Researchers measure the signals and the alarm proteins released by cells.",
    "how": "Some gut and immune cells have a carrier called PepT1 that can bring small peptides across the cell surface. In the cited experiments, this carrier brought KPV into cells. Inside, KPV reduced activity in pathways such as NF-kB that help switch on inflammatory-response genes.\n\nThose genes tell cells to release proteins called cytokines, which pass alarm messages to other cells. Fewer of these messages were released in the experiments. That is the proposed sequence: entry through a carrier, less alarm-pathway activity, then less alarm-protein output. It describes a measured cell response, not a demonstrated treatment from this product.",
    "limit": "The uptake pathway depends on the cell type. These findings do not establish that the product treats inflammation or any medical condition.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/kpv", "type": "product"},
      {"label": "KPV: PepT1 uptake and inflammatory messages in cells", "url": "https://pubmed.ncbi.nlm.nih.gov/18061177/", "type": "paper"}
    ]
  },
  "klow": {
    "name": "KLOW",
    "aliases": [],
    "summary": "Four compounds with different cell-response research targets.",
    "what": "KLOW combines BPC-157, TB-500, GHK-Cu and KPV. Each is a separate compound within the same product.",
    "study": "The ingredients are studied for cell movement, support-material turnover and inflammatory messages. A blend study would need to measure whether combining them changes those separate responses.",
    "how": "KLOW combines BPC-157, TB-500, GHK-Cu and KPV. BPC-157 research follows proteins that help cells grip and move. Thymosin-related research follows actin, the movable fibers inside cells. GHK-Cu holds copper and is studied in the production of the scaffold around cells. KPV research follows messages that keep an inflammatory response active.\n\nThese are different jobs, not four steps in a proven KLOW pathway. Combining ingredients can change their exposure and interactions. There is no established whole-blend mechanism in the sources reviewed here, and evidence from one ingredient cannot show that the mixture acts more strongly or produces the same result.",
    "limit": "Ingredient research is not a test of KLOW. The exact TB-500 form and each ingredient amount remain important; no combined benefit or ratio is assumed.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/klow", "type": "product"},
      {"label": "BPC-157 cell-attachment research", "url": "https://pubmed.ncbi.nlm.nih.gov/21030672/", "type": "paper", "note": "Individual ingredient, not a KLOW experiment."},
      {"label": "GHK-Cu connective-tissue research", "url": "https://pubmed.ncbi.nlm.nih.gov/8227353/", "type": "paper", "note": "Individual ingredient, not a KLOW experiment."},
      {"label": "KPV cell-uptake and inflammatory-response research", "url": "https://pubmed.ncbi.nlm.nih.gov/18061177/", "type": "paper", "note": "Individual ingredient, not a KLOW experiment."}
    ]
  },
  "semax": {
    "name": "SEMAX",
    "aliases": ["Semax"],
    "summary": "A peptide studied in nerve cells’ growth and connection messages.",
    "what": "SEMAX is a lab-made chain of seven amino acids. Its design is based on a piece of another peptide called ACTH.",
    "study": "Researchers test whether SEMAX changes proteins involved in nerve-cell connections and responses to stress. BDNF, a protein that helps regulate these connections, is one measured part of the pathway.",
    "how": "Nerve cells use BDNF as one of their growth and maintenance messages. BDNF attaches to a receiving protein called TrkB. That receptor can start processes involved in cell survival and the strength of connections between nerve cells. In rat experiments, SEMAX changed BDNF levels and TrkB activity.\n\nThat gives researchers a concrete pathway to investigate, but it does not show that SEMAX itself directly plugs into TrkB. The first step between exposure to SEMAX and the later BDNF changes remains uncertain. Scientists are testing that missing link, rather than treating all nerve-cell effects as an established mechanism.",
    "limit": "Changes in rat nerve-cell markers do not establish improved memory, focus or any other personal-use benefit from this product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/semax", "type": "product"},
      {"label": "SEMAX: BDNF and TrkB measurements in rat hippocampus", "url": "https://pubmed.ncbi.nlm.nih.gov/16996037/", "type": "paper"}
    ]
  },
  "glutathione": {
    "name": "Glutathione",
    "aliases": ["GSH"],
    "summary": "A small molecule used in cells’ peroxide-cleanup reactions.",
    "what": "Glutathione is made from three amino acids. Cells make it and use it in many chemical reactions.",
    "study": "Research looks at how cells handle reactive chemicals and recycle their protective molecules. A common measurement compares reduced glutathione, GSH, with its used, oxidized form, GSSG.",
    "how": "Glutathione can donate electrons during chemical reactions. In one well-established example, an enzyme called glutathione peroxidase uses it to turn hydrogen peroxide into water. Peroxide is a reactive chemical that can damage cell components when it builds up. Two glutathione molecules are linked together in the process, forming GSSG.\n\nAnother enzyme uses a helper molecule called NADPH to separate and recharge that pair into GSH. This cleanup-and-recycling loop is what scientists measure in many cell-stress studies. Describing glutathione as a general detox misses the chemistry: it works in particular enzyme reactions and depends on the rest of the cell's recycling system.",
    "limit": "A known cell reaction is not evidence that this product enters cells, removes a specific toxin or produces a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/glutathione", "type": "product"},
      {"label": "Original glutathione-peroxidase enzyme study", "url": "https://pubmed.ncbi.nlm.nih.gov/13491573/", "type": "paper"},
      {"label": "How glutathione reductase uses NADPH", "url": "https://pubmed.ncbi.nlm.nih.gov/3707573/", "type": "paper"}
    ]
  },
  "melanotan-ii": {
    "name": "Melanotan II",
    "aliases": ["Melanotan 2", "MTII"],
    "summary": "A peptide studied at several melanocortin receptors.",
    "what": "Melanotan II is a lab-made peptide shaped like a small ring. It is related to a natural signal called alpha-MSH.",
    "study": "Researchers use Melanotan II to examine how melanocortin receptors affect pigment-cell activity and nerve signals. Different receptor types and cell models can produce different responses.",
    "how": "Melanotan II copies part of the message carried by alpha-MSH, a natural signaling peptide. Its ring-shaped structure can activate several melanocortin receptors. At MC1, the receiving point involved in pigment-cell biology, the signal can start the machinery that makes melanin, the pigment that gives cells color.\n\nAt other receptors, including MC4, researchers measure changes in nerve-cell activity and food-intake signaling. Cell studies show that some signals can continue after the peptide is removed from the surrounding liquid. Because it acts at several targets, a result cannot automatically be assigned to one receptor or interpreted as a single useful effect.",
    "limit": "These are research pathways, not claims of tanning, weight change or personal-use suitability. Effects depend on receptor type and experimental conditions.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/melanotan-ii", "type": "product"},
      {"label": "Melanotan II: timing of MC4 receptor signals", "url": "https://pubmed.ncbi.nlm.nih.gov/26418335/", "type": "paper"},
      {"label": "Melanotan II binding to MC1 in cell experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/33073191/", "type": "paper", "note": "The cited work uses conjugated molecules in cell research, not this product or a personal-use application."}
    ]
  },
  "glow": {
    "name": "GLOW",
    "aliases": ["GLOW blend"],
    "summary": "Three compounds studied in cell movement and support-material turnover.",
    "what": "GLOW contains three compounds: BPC-157, TB-500 and GHK-Cu. It is not the four-compound KLOW blend.",
    "study": "Research on the separate ingredients asks how cells move and how the material around them is rebuilt or broken down. It does not establish a single shared result for the blend.",
    "how": "GLOW combines BPC-157, TB-500 and GHK-Cu. BPC-157 experiments look at cell grip points, which help a cell pull itself across a surface. Research on thymosin-related peptides concerns actin, part of the cell's movable frame. GHK-Cu research examines copper binding and the cells that make collagen and other surrounding material.\n\nPutting those compounds together does not prove they act as a coordinated repair system. Their forms, amounts and interactions could change the response. The sources here explain the individual research ideas; they do not identify one confirmed mechanism for GLOW or show that the blend outperforms its ingredients.",
    "limit": "Individual-compound findings are not blend results. No skin, recovery or other benefit is established for this product by the sources below.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/glow", "type": "product"},
      {"label": "BPC-157 and cell movement", "url": "https://pubmed.ncbi.nlm.nih.gov/21030672/", "type": "paper", "note": "Ingredient research, not a GLOW experiment."},
      {"label": "Full thymosin beta-4 and actin-related research", "url": "https://pubmed.ncbi.nlm.nih.gov/10469335/", "type": "paper", "note": "Not proof of the exact TB-500 form or this blend."},
      {"label": "GHK-Cu and connective-tissue production", "url": "https://pubmed.ncbi.nlm.nih.gov/8227353/", "type": "paper", "note": "Ingredient research, not a GLOW experiment."}
    ]
  },
  "selank": {
    "name": "SELANK",
    "aliases": ["Selank"],
    "summary": "A peptide studied in the signals that slow nerve-cell firing.",
    "what": "SELANK is a lab-made peptide based on tuftsin, another short peptide. It has seven amino-acid building blocks.",
    "study": "The question is whether SELANK changes the way cells respond to GABA, a chemical message that usually reduces nerve activity. Researchers examine receptor-related genes and responses to GABA, not just outward behavior.",
    "how": "GABA is often described as a brake in nerve circuits because it can make a nerve cell less likely to fire. SELANK research asks whether it changes the response to that braking message. Experiments have measured changes in genes linked to GABA signaling and differences when cells receive both SELANK and GABA.\n\nOne cell study found no gene-expression change from SELANK alone, but found changes when GABA was also present. That distinction matters: it does not establish that SELANK directly activates a GABA receptor, or works like a sedative. How the peptide causes the reported changes is still being investigated.",
    "limit": "Evidence about GABA-related gene activity does not prove an anxiety, mood or sleep benefit from this research product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/selank", "type": "product"},
      {"label": "SELANK and GABA-related gene activity", "url": "https://pubmed.ncbi.nlm.nih.gov/26924987/", "type": "paper"},
      {"label": "Cells exposed to SELANK alone and with GABA", "url": "https://pubmed.ncbi.nlm.nih.gov/28293190/", "type": "paper"}
    ]
  },
  "melanotan-i": {
    "name": "Melanotan I",
    "aliases": ["Melanotan 1", "MTI"],
    "summary": "An alpha-MSH-like peptide studied in pigment-cell signaling.",
    "what": "Melanotan I is a lab-made chain related to alpha-MSH, a natural cell signal. It is different from ring-shaped Melanotan II.",
    "study": "Research examines how the MC1 receptor controls melanin production. Melanin is a pigment made by specialized cells; receptor studies help separate pigment chemistry from other cell responses.",
    "how": "Melanotan I is based on alpha-MSH, a natural message recognized by melanocortin receptors. The best-known research target is MC1 on pigment-making cells. Activation of MC1 raises an internal messenger called cAMP. That message helps switch on proteins and enzymes involved in making melanin.\n\nThe useful research question is how receptor activity changes the cell's pigment-making machinery, not whether a vial gives a cosmetic result. Different versions of the MC1 receptor can respond differently. The peptide does not contain melanin, and it is not a sunscreen or a substitute for the many processes that protect a cell.",
    "limit": "This explains pigment-cell biology. It is not a tanning, cosmetic or sun-protection claim for the research product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/melanotan-i", "type": "product"},
      {"label": "Melanotan I and differences in the MC1 receptor", "url": "https://pubmed.ncbi.nlm.nih.gov/16293341/", "type": "paper"}
    ]
  },
  "igf-1-lr3": {
    "name": "IGF-1 LR3",
    "aliases": ["IGF1 LR3"],
    "summary": "A modified IGF-1 used to study cell growth and protein production.",
    "what": "IGF-1 LR3 is a lab-made version of IGF-1, a protein signal. It has an added section and a changed building block.",
    "study": "Labs compare cell division, protein production and receptor responses. The LR3 changes help researchers study how binding proteins can limit the amount of IGF available to reach a cell.",
    "how": "IGF-1 reaches a cell's IGF-1 receptor and activates signals involved in protein production, survival and division. Binding proteins outside the cell can catch IGF-1 before it reaches that receptor. The LR3 version has an added amino-acid segment and one changed building block that reduce its attachment to those binding proteins.\n\nThat can leave more of the compound free in a cell-culture experiment. It does not mean that the receptor itself is always activated more strongly. The original comparison found that activity depended on whether the cells released binding proteins. Researchers use that difference to study availability separately from the receptor's response.",
    "limit": "More cell growth is not automatically desirable. These cell-culture findings do not establish muscle, performance or other personal-use benefits.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/igf-1-lr3", "type": "product"},
      {"label": "Original Long R3 IGF-I binding and cell-growth comparison", "url": "https://pubmed.ncbi.nlm.nih.gov/1378742/", "type": "paper"}
    ]
  },
  "5-amino-1mq": {
    "name": "5-Amino-1MQ",
    "aliases": ["1MQ", "5 amino 1 mq"],
    "summary": "A small molecule studied as a blocker of the NNMT enzyme.",
    "what": "5-Amino-1MQ is a small chemical compound, not a peptide. Its target is an enzyme called NNMT.",
    "study": "Researchers ask whether blocking NNMT changes how cells use nicotinamide, a form of vitamin B3. They measure the enzyme’s product and related fuel-processing chemicals inside cells.",
    "how": "NNMT is an enzyme, a protein that performs a chemical job. It normally adds a small chemical tag to nicotinamide, turning it into another molecule called 1-MNA. 5-Amino-1MQ is studied as a blocker of that job. Less 1-MNA production is one sign that the enzyme has been inhibited.\n\nNicotinamide can also be recycled into NAD+, a helper used in many cell reactions. Blocking NNMT may change how much material remains for that route, as well as other tag-transfer reactions. Researchers measure those changes rather than assuming the entire cell's metabolism improves. This compound is not a peptide and does not work by supplying a hormone.",
    "limit": "Enzyme inhibition and changes in cell chemicals do not establish weight, energy or other health benefits from this product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/5-amino-1mq", "type": "product"},
      {"label": "5-Amino-1MQ: NNMT inhibition and cellular chemistry", "url": "https://pubmed.ncbi.nlm.nih.gov/29155147/", "type": "paper"}
    ]
  },
  "wolverine-stack": {
    "name": "BPC-157/TB-500 (Wolverine)",
    "aliases": ["Wolverine", "BPC TB blend"],
    "summary": "A two-peptide blend for research on cell movement.",
    "what": "This product combines BPC-157 and TB-500. Wolverine is the partner’s name for this two-compound blend.",
    "study": "The ingredients are investigated in cell movement and tissue-response models. A meaningful blend experiment must compare the mixture with each ingredient alone.",
    "how": "BPC-157 research follows proteins such as FAK and paxillin that help a cell attach to its surroundings and move. Research on full thymosin beta-4 follows actin, a protein whose fibers help cells change shape. These are related parts of cell movement, but they are not the same target.\n\nBPC-157/TB-500 (Wolverine) combines two named products around that research idea. The exact TB-500 sequence matters because a short fragment need not behave like full thymosin beta-4. A shared research topic does not establish that the ingredients cooperate, accelerate tissue repair, or have a confirmed combined mechanism.",
    "limit": "The name Wolverine is a blend name, not an outcome. Individual studies do not establish the behavior or suitability of the mixture.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/wolverine-stack", "type": "product"},
      {"label": "BPC-157 tendon-cell movement experiment", "url": "https://pubmed.ncbi.nlm.nih.gov/21030672/", "type": "paper"},
      {"label": "Full thymosin beta-4 research", "url": "https://pubmed.ncbi.nlm.nih.gov/10469335/", "type": "paper", "note": "This study is not evidence for an unspecified TB-500 fragment or the combined product."}
    ]
  },
  "pt-141": {
    "name": "PT-141",
    "aliases": ["Bremelanotide", "pt141"],
    "summary": "A peptide studied in melanocortin-driven nerve signals.",
    "what": "PT-141 is a lab-made, ring-shaped peptide related to alpha-MSH, a natural cell signal.",
    "study": "Researchers study how melanocortin receptors activate nerve circuits involved in sexual-response signaling. That identifies the research question, not a benefit established for this product.",
    "how": "PT-141 is based on alpha-MSH, a natural signaling peptide. It can activate melanocortin receptors, including MC3 and MC4, found in the nervous system. Receptor activation changes messages inside nerve cells and can change the activity of the larger circuit they belong to.\n\nIn early rat experiments, researchers measured activation in the hypothalamus, a brain region that coordinates several automatic functions. This is why the mechanism is studied as a nerve-signaling route rather than simply a direct effect on local blood flow. Which exact circuits account for each response is more complex than saying it flips one desire switch.",
    "limit": "This is not a claim of increased desire or treatment of sexual dysfunction. Research on PT-141 does not validate the supplier’s product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/pt-141", "type": "product"},
      {"label": "PT-141: melanocortin receptors and nerve-circuit experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/12851303/", "type": "paper"}
    ]
  },
  "cagrilintide": {
    "name": "Cagrilintide",
    "aliases": ["CAG"],
    "summary": "An amylin-like peptide studied in food-intake signaling.",
    "what": "Cagrilintide is a changed form of amylin, a natural peptide signal. It has 37 amino-acid building blocks.",
    "study": "Research asks how amylin-related receptors help signal that food has been consumed. Scientists measure receptor activation and the nerve pathways that influence meal size and food intake.",
    "how": "Amylin is a natural message released alongside insulin after food intake. Cagrilintide is designed to copy parts of that message. It can activate amylin receptors, made from a calcitonin receptor joined to a helper protein, as well as the calcitonin receptor itself. These combinations change how the cell recognizes the peptide.\n\nAmylin signaling includes nerve pathways that help report a meal and influence when eating stops. Researchers investigate how cagrilintide engages these pathways and how its receptor balance differs from natural amylin. It is not a GLP-1 peptide, and acting on a food-intake pathway does not establish a weight-related result for this research product.",
    "limit": "Receptor and experimental findings do not establish appetite, weight or medical benefits from the merchant’s vial.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/cagrilintide", "type": "product"},
      {"label": "Cagrilintide structures at amylin and calcitonin receptors", "url": "https://pubmed.ncbi.nlm.nih.gov/40204768/", "type": "paper"}
    ]
  },
  "aod-9604": {
    "name": "AOD-9604",
    "aliases": ["AOD"],
    "summary": "A growth-hormone fragment studied in fat-cell chemistry.",
    "what": "AOD-9604 is a lab-made peptide modeled on a small end section of growth hormone. It is not the whole hormone.",
    "study": "Researchers examine fat breakdown and fat storage in cell and animal models. They ask whether a small part of growth hormone can affect those processes separately from the full hormone.",
    "how": "AOD-9604 is based on a small section near one end of growth hormone, with an added amino acid. Early animal experiments studied whether it changed how fat cells respond to signals that release stored fat. Some work examined beta-3 receptors, receiving points involved in that response.\n\nThose experiments do not provide a complete, agreed explanation of the first target or every step that follows. A fragment cannot be assumed to carry all the actions of the full hormone, and an effect on fat-cell chemistry is not the same as a demonstrated change in body weight. The precise mechanism remains incompletely resolved.",
    "limit": "The early animal findings are not proof of fat loss or personal-use suitability. This is not interchangeable with full-length growth hormone.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/aod-9604", "type": "product"},
      {"label": "AOD9604: fat metabolism and beta-3 receptor experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/11713213/", "type": "paper"},
      {"label": "AOD9604 molecular identity and breakdown products", "url": "https://pubmed.ncbi.nlm.nih.gov/25208511/", "type": "paper"}
    ]
  },
  "dsip": {
    "name": "DSIP",
    "aliases": [],
    "summary": "A peptide investigated in sleep-related brain signaling.",
    "what": "DSIP is a short peptide with nine amino-acid building blocks.",
    "study": "Researchers have examined brain activity, sleep patterns and release of other signaling peptides. Its historical name, delta sleep-inducing peptide, is not evidence that it predictably produces sleep.",
    "how": "There is no well-established single receptor that explains all reported DSIP effects. One experiment in slices of rat brainstem found more release of Met-enkephalin, another small signaling peptide. The release depended on calcium, which cells often use as a trigger to empty stored packets of a chemical message.\n\nDSIP did not directly bind opioid receptors in that experiment, even though enkephalins act through that receptor family. This illustrates a possible indirect route: changing release of a messenger rather than replacing the messenger itself. It still does not settle how DSIP relates to sleep, and a simple sleep-switch explanation would go beyond the evidence.",
    "limit": "The mechanism is unresolved. Neither the product name nor a brain-tissue experiment proves sleep improvement or any benefit from this product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/dsip", "type": "product"},
      {"label": "DSIP and calcium-dependent peptide release in rat brainstem", "url": "https://pubmed.ncbi.nlm.nih.gov/2706459/", "type": "paper"}
    ]
  },
  "epithalon": {
    "name": "Epithalon",
    "aliases": ["Epitalon", "EPI"],
    "summary": "A short peptide studied in telomere-maintenance experiments.",
    "what": "Epithalon is a lab-made chain of four amino acids. It is a short peptide, not a whole protein.",
    "study": "Scientists measure telomerase activity and telomere length in cultured cells. Telomeres are repeated DNA sections at chromosome ends; they are not a single measure of a whole organism’s age or health.",
    "how": "Telomeres are protective end sections of chromosomes, the packages that hold DNA. They can shorten as cells divide. Telomerase is an enzyme that adds repeated DNA back to these ends. In a small cell-culture study, Epithalon exposure was followed by more telomerase activity and longer telomeres.\n\nThe proposed idea is that the peptide changes how cells produce or control this enzyme. That first molecular step has not been fully established. Epithalon does not itself act as a replacement telomere or prove that damaged DNA has been repaired. Researchers must distinguish a laboratory marker from useful, controlled cell behavior.",
    "limit": "Telomere changes in cultured cells do not establish longer life or age reversal. Increased telomerase activity is not automatically beneficial.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/epithalon", "type": "product"},
      {"label": "Epithalon and telomerase in cultured cells", "url": "https://pubmed.ncbi.nlm.nih.gov/12937682/", "type": "paper"},
      {"label": "Proposed gene-regulation model", "url": "https://pubmed.ncbi.nlm.nih.gov/14666197/", "type": "paper", "note": "A proposed explanation, not confirmation of the complete mechanism."}
    ]
  },
  "ipamorelin": {
    "name": "Ipamorelin",
    "aliases": ["IPA"],
    "summary": "A peptide studied at the ghrelin receptor on pituitary cells.",
    "what": "Ipamorelin is a lab-made peptide with five amino-acid building blocks.",
    "study": "Researchers examine how ghrelin-receptor activation triggers the release of growth hormone. Receptor-blocking experiments help distinguish this route from the separate GHRH pathway.",
    "how": "Ipamorelin activates the ghrelin receptor, also called GHSR. On suitable pituitary cells, that receptor starts an internal signal that can trigger release of stored growth hormone. Early studies measured this release in cultured rat pituitary cells and compared the response with other hormone-release signals.\n\nIt is a messenger to a gland, not growth hormone itself. That distinction matters because the response depends on the cells and their existing control system. The GHRH receptor is a different receiving point, so evidence about GHRH-like peptides cannot simply be used to explain Ipamorelin. Researchers study both the receptor route and the resulting release pattern.",
    "limit": "A pituitary-cell response does not establish muscle, recovery, hormonal or other personal-use benefits from the product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/ipamorelin", "type": "product"},
      {"label": "Ipamorelin: original pituitary-cell and receptor research", "url": "https://pubmed.ncbi.nlm.nih.gov/9849822/", "type": "paper"}
    ]
  },
  "snap-8": {
    "name": "SNAP-8",
    "aliases": ["Acetyl octapeptide 3"],
    "summary": "A peptide designed to probe how nerve cells release messages.",
    "what": "SNAP-8 is a lab-made peptide with eight amino acids. Its design copies a small part of the protein SNAP-25.",
    "study": "The research idea is to interfere with the protein machinery that lets a nerve cell release a chemical message. The intended target is message-packet release, not direct replacement of the message.",
    "how": "Nerve cells store chemical messages in tiny packets. To release a packet, its surface must join the cell's outer membrane. Several proteins form a zipper-like assembly called the SNARE complex that brings the two surfaces together. SNAP-25 is one part of that assembly.\n\nSNAP-8 is designed to resemble a small part of SNAP-25. The proposed idea is that this imitation could get in the way of the working assembly and reduce packet release. This is a design hypothesis, not a confirmed result for this product. Research on shorter, related peptides cannot establish that this eight-part peptide acts the same way.",
    "limit": "The proposed release mechanism is not a cosmetic claim. It does not prove that this product reaches nerve cells or produces a useful effect.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/snap-8", "type": "product"},
      {"label": "Structure of the nerve-message release machinery", "url": "https://pubmed.ncbi.nlm.nih.gov/9759724/", "type": "paper", "note": "Background SNARE structure, not proof that SNAP-8 blocks this process."},
      {"label": "Experiments on the primed nerve-message release complex", "url": "https://pubmed.ncbi.nlm.nih.gov/28813412/", "type": "paper", "note": "Explains packet release. It does not test this supplier’s SNAP-8."}
    ]
  },
  "thymosin-alpha-1": {
    "name": "Thymosin Alpha-1",
    "aliases": ["Thymalfasin", "TA1"],
    "summary": "A peptide studied in how immune cells recognize and report threats.",
    "what": "Thymosin Alpha-1 is a lab-made version of a peptide with 28 amino acids.",
    "study": "Researchers examine how immune cells detect microbes and pass that information to other cells. Experiments measure cell maturation and the messages used to coordinate a response.",
    "how": "Some immune cells act as scouts. They detect a possible threat, process pieces of it and send messages to other immune cells. Thymosin Alpha-1 has been studied in how these scouts, including dendritic cells, mature and respond. Experiments have linked parts of that response to Toll-like receptors, a family of threat-sensing proteins.\n\nIn the cited work, researchers also measured IL-12, a message that helps guide other immune cells. The proposed effect is on how a response is organized, not a simple on-switch that makes all immunity stronger. The pathway depends on the cell, the trigger and the experimental setting.",
    "limit": "Immune-response markers do not establish infection protection or any treatment benefit from this research product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/thymosin-alpha-1", "type": "product"},
      {"label": "Thymosin Alpha-1: dendritic-cell and threat-sensing experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/14982877/", "type": "paper"}
    ]
  },
  "ll-37": {
    "name": "LL-37",
    "aliases": [],
    "summary": "A peptide studied for its interactions with microbial membranes.",
    "what": "LL-37 is a peptide with 37 amino acids. It belongs to a group called host-defense peptides.",
    "study": "Scientists test how LL-37 changes the barrier around microbes and how that differs from its effects on other cell membranes. They measure leakage, membrane shape and microbial survival.",
    "how": "LL-37 has regions with different chemical properties, including a positive charge that helps it interact with some microbial surfaces. When enough peptide collects at a membrane, it can disturb the tightly packed fatty molecules that form the barrier. Experiments have observed channels or other disruptions that let material leak across it.\n\nA damaged barrier can stop a microbe from keeping its internal conditions stable. But the details change with the membrane's composition and the surrounding liquid. LL-37 can affect non-microbial cells too. It is studied as a membrane-active peptide, not a substance that can be assumed to recognize only harmful cells.",
    "limit": "Membrane experiments do not establish a safe antibiotic or personal-use product. Effects on ordinary cells are an important limitation.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/ll-37", "type": "product"},
      {"label": "LL-37: membrane channels in laboratory models", "url": "https://pubmed.ncbi.nlm.nih.gov/21463582/", "type": "paper"},
      {"label": "LL-37 interactions with different cell-membrane types", "url": "https://pubmed.ncbi.nlm.nih.gov/10417311/", "type": "paper"}
    ]
  },
  "cartalax": {
    "name": "Cartalax",
    "aliases": ["AED"],
    "summary": "A short peptide studied in cell growth and gene activity.",
    "what": "Cartalax is a lab-made peptide of three amino acids. Their sequence is often shortened to AED.",
    "study": "Early work on the AED peptide examines gene activity in cultured cells as they age. The question is whether it changes how cells read some growth and stress-related instructions.",
    "how": "Genes are instructions a cell can read to make proteins. Research on AED, the three-amino-acid chain associated with Cartalax, has measured changes in the reading of genes such as IGF1 in cultured stem cells. IGF1 carries instructions for a growth-related signal; measuring its activity shows a response, not the entire mechanism.\n\nOne proposed explanation is that very short peptides interact with DNA or proteins that control access to it. That is not the same as proving a direct DNA-binding route in living tissue. The first target and the complete sequence remain uncertain, so Cartalax should not be described as a proven cartilage-rebuilding signal.",
    "limit": "The cited gene-expression experiment was not a cartilage-repair trial. It does not establish a joint, anti-aging or other benefit from this product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/cartalax", "type": "product"},
      {"label": "AED peptide and gene activity in cultured stem cells", "url": "https://pubmed.ncbi.nlm.nih.gov/32399807/", "type": "paper"},
      {"label": "Short-peptide gene-regulation research", "url": "https://pubmed.ncbi.nlm.nih.gov/27909961/", "type": "paper", "note": "Contains proposed molecular explanations; it does not establish a clinical outcome for Cartalax."}
    ]
  },
  "sermorelin": {
    "name": "Sermorelin",
    "aliases": ["SERM"],
    "summary": "A GHRH fragment studied in pituitary growth-hormone release.",
    "what": "Sermorelin is a 29-part peptide based on the active end of growth hormone-releasing hormone, or GHRH.",
    "study": "Scientists use a shorter version of GHRH to study how the pituitary responds to its normal release signal. They examine receptor activation and growth-hormone output.",
    "how": "Sermorelin is based on the first 29 amino acids of GHRH, a natural hormone-release message. This part can activate the GHRH receptor on pituitary cells. The receptor then starts internal signaling that prompts those cells to release growth hormone they already contain.\n\nIt works as a signal to the gland, not as a supply of growth hormone. The response is shaped by the gland and by other signals that can oppose or modify it. Researchers compare this shorter message with altered GHRH-like molecules to study receptor activity and breakdown. They do not assume that similarly named peptides have the same behavior.",
    "limit": "A GHRH-based mechanism does not establish a predictable hormonal or personal-use result from this research product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/sermorelin", "type": "product"},
      {"label": "Research comparing GHRH-derived peptide designs", "url": "https://pubmed.ncbi.nlm.nih.gov/15817669/", "type": "paper", "note": "Provides GHRH-fragment and receptor context; it is not a test of this supplier’s Sermorelin."}
    ]
  },
  "kisspeptin": {
    "name": "Kisspeptin",
    "aliases": ["Kisspeptin-10", "KP10"],
    "summary": "A peptide studied in the nerve signal that starts a hormone cascade.",
    "what": "This product is the 10-part form of kisspeptin, a peptide signal. The partner names it Kisspeptin.",
    "study": "Research examines how kisspeptin activates GnRH nerve cells. These cells sit near the start of the signaling chain that coordinates reproductive hormones.",
    "how": "Kisspeptin reaches a receptor called KISS1R on certain nerve cells. This changes the flow of charged particles across the cell surface, making those cells more likely to fire. The activated cells can release GnRH, a hormone message sent to the pituitary gland.\n\nGnRH then helps control the release of LH and FSH, the next messengers in the reproductive-hormone chain. That is why kisspeptin is studied as an upstream signal, not a direct replacement for the hormones at the end of the chain. Researchers use nerve recordings and hormone measurements to find which steps actually occur in a given model.",
    "limit": "Explaining this hormone cascade is not a fertility or hormonal-benefit claim for the product. Responses depend on the research model.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/kisspeptin", "type": "product"},
      {"label": "Kisspeptin receptor and GnRH-release experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/15665093/", "type": "paper"},
      {"label": "How kisspeptin changes electrical activity in GnRH cells", "url": "https://pubmed.ncbi.nlm.nih.gov/18434521/", "type": "paper"}
    ]
  },
  "dihexa": {
    "name": "Dihexa",
    "aliases": ["PNB-0408"],
    "summary": "An experimental compound with a disputed nerve-connection mechanism.",
    "what": "Dihexa is a small lab-made compound modeled on part of a peptide called angiotensin IV.",
    "study": "Dihexa has been investigated in the formation of connections between nerve cells. A key paper supporting its best-known explanation was retracted, so that explanation must be presented as uncertain rather than established.",
    "how": "The proposed idea was that Dihexa strengthens the action of HGF, a protein message involved in cell growth. HGF can activate a receptor called c-Met, which starts processes involved in cell survival, movement and growth. Researchers proposed that changing this route might alter connections between nerve cells.\n\nHowever, the 2014 paper linking Dihexa's nerve-connection effects to HGF/c-Met was retracted in 2025. A retracted paper cannot support a confident claim that this mechanism works. The pathway above explains the hypothesis that was proposed; it is not a verified explanation of this research product's action or evidence of improved memory.",
    "limit": "The key mechanism paper was retracted. This evidence problem cannot be fixed by a research-only disclaimer or by repeating the original claim.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/dihexa", "type": "product"},
      {"label": "Retraction notice for the 2014 HGF/c-Met paper", "url": "https://pubmed.ncbi.nlm.nih.gov/40312093/", "type": "paper", "note": "Retraction notice, not evidence supporting the proposed mechanism."}
    ]
  },
  "vip": {
    "name": "VIP",
    "aliases": ["Vasoactive intestinal peptide"],
    "summary": "A peptide studied in gut, smooth-muscle and cell-message systems.",
    "what": "VIP is a peptide made from 28 amino acids. It acts as a chemical message between cells.",
    "study": "Labs investigate how VIP receptors change activity in gut cells, smooth muscle and other cell types. The same initial signal can have different effects depending on the cell receiving it.",
    "how": "VIP is a natural messenger peptide that binds receptors called VPAC1 and VPAC2. These receptors can increase cAMP, a small messenger inside the cell. cAMP passes the signal to proteins that control what the cell does next, rather than acting as a final result by itself.\n\nIn gut-related research, downstream responses include changes in movement of salt and fluid. In smooth-muscle research, scientists study changes in contraction. These are different outputs from a shared signaling route. Measuring a VIP receptor response does not mean every tissue will respond alike, or that a particular vial will produce a useful effect.",
    "limit": "This is cell and receptor biology, not evidence that the product treats a gut, breathing or other medical condition.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/vip", "type": "product"},
      {"label": "VIP receptor signaling and cAMP experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/10933794/", "type": "paper"},
      {"label": "Where VIP receptors are found in intestinal cells", "url": "https://pubmed.ncbi.nlm.nih.gov/28385693/", "type": "paper"}
    ]
  },
  "ara-290": {
    "name": "ARA-290",
    "aliases": ["Cibinetide"],
    "summary": "An EPO-derived peptide studied in cells’ response to stress.",
    "what": "ARA-290 is an 11-part peptide modeled on a small surface of erythropoietin, often shortened to EPO.",
    "study": "Researchers ask whether a small part of erythropoietin, or EPO, can affect cell-stress responses without copying its main red-blood-cell signal. Studies examine damage markers and cell-death pathways.",
    "how": "Full EPO is best known for signaling the production of red blood cells. ARA-290 was designed from a small region of EPO to investigate a different response to tissue stress. The proposed receiving system pairs an EPO receptor with a partner called CD131, rather than the receptor arrangement used for red-blood-cell production.\n\nResearch follows whether this route changes inflammatory messages and the internal steps that lead stressed cells to die. This is a targeted research hypothesis, not a general repair command. The receptor model and downstream observations must be distinguished from proof that the merchant's product protects tissue or produces a useful result.",
    "limit": "The proposed stress-response pathway does not establish tissue repair, pain relief or any other personal-use benefit from this product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/ara-290", "type": "product"},
      {"label": "ARA290: stress-response and cell-death pathways in an experimental model", "url": "https://pubmed.ncbi.nlm.nih.gov/36085231/", "type": "paper"}
    ]
  },
  "pinealon": {
    "name": "Pinealon",
    "aliases": ["EDR"],
    "summary": "A short peptide studied in nerve-cell responses to chemical stress.",
    "what": "Pinealon is a lab-made peptide of three amino acids. Their sequence is often shortened to EDR.",
    "study": "Researchers measure reactive oxygen compounds, cell survival and growth signals after exposing cells to a stressor. The question is whether Pinealon changes that stress response and which steps are involved.",
    "how": "Cells produce reactive oxygen compounds during normal chemistry. If too many build up, they can damage cell components. In cell experiments, Pinealon was associated with less accumulation of these compounds and changes in ERK, a protein pathway involved in cell responses and growth.\n\nOne study found a delay in ERK activity alongside changes in cell death and the cell cycle. Those are measured clues, not proof that Pinealon directly neutralizes every reactive molecule. Researchers have not established one complete target-to-effect chain. Its role is being investigated through these specific stress markers rather than assumed from a general brain-support label.",
    "limit": "Cell-survival markers do not establish improved memory, cognition or any other personal-use effect from this research product.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/pinealon", "type": "product"},
      {"label": "Pinealon: reactive oxygen and cell-response experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/21978084/", "type": "paper"}
    ]
  },
  "ahk-cu": {
    "name": "AHK-Cu",
    "aliases": ["ahkcu"],
    "summary": "A copper-binding peptide studied in follicle-support cells.",
    "what": "AHK-Cu joins three amino acids to copper. Its first building block differs from GHK-Cu, so they are not the same molecule.",
    "study": "Studies examine cells at the base of hair follicles, which help control the follicle’s behavior. Researchers measure cell number and proteins involved in cell survival, not just the presence of copper.",
    "how": "AHK is a three-amino-acid chain that binds copper. In the cited study, researchers exposed isolated follicles and cultured dermal papilla cells, the support cells at a follicle's base, to AHK-Cu. They observed changes in cell growth and in proteins involved in the balance between survival and programmed cell death.\n\nThe full molecular route is not settled. A change in survival-related proteins does not prove that AHK-Cu directly flips one growth switch, and not every cell-death measurement in the study was statistically significant. The work supplies a specific laboratory question about follicle-cell behavior, not a demonstrated result from the research product.",
    "limit": "Follicle-culture findings do not establish hair growth or a cosmetic benefit from this product. AHK-Cu and GHK-Cu are different peptides.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/ahk-cu", "type": "product"},
      {"label": "AHK-Cu: isolated follicle and support-cell experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/17703734/", "type": "paper"}
    ]
  },
  "ghkcu-spray": {
    "name": "GHK-Cu SPRAY",
    "aliases": [],
    "summary": "A GHK-Cu solution for copper and connective-tissue research.",
    "what": "GHK-Cu SPRAY is a prepared liquid containing GHK-Cu. It is a different product from the non-spray form.",
    "study": "The research focus is the copper-binding compound and how cells manage their surrounding support material. The prepared solution also has its own composition, which may affect a laboratory result.",
    "how": "GHK-Cu is a short peptide that holds a copper ion. Researchers study how exposure to this complex changes the production and turnover of collagen and other material around cells. Collagen forms strong fibers; the peptide is investigated for effects on the cells doing that work, not as collagen added to the sample.\n\nThe SPRAY format places GHK-Cu in a prepared liquid. A format name does not create a different confirmed cell mechanism, show how much intact compound reaches a target, or prove the solution acts like material used in a paper. Its other ingredients and concentration need separate verification.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/ghkcu-spray", "type": "product"},
      {"label": "GHK-Cu and connective-tissue production in an experimental model", "url": "https://pubmed.ncbi.nlm.nih.gov/8227353/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "nad-plus-spray": {
    "name": "NAD+ SPRAY",
    "aliases": [],
    "summary": "A prepared NAD+ solution for cell-chemistry research.",
    "what": "NAD+ SPRAY is a prepared liquid containing NAD+. It is a different product from the non-spray form.",
    "study": "Labs examine the NAD+/NADH carrier cycle and enzymes that require NAD+. A study of the molecule is separate from a study of this particular prepared solution.",
    "how": "NAD+ accepts electrons during some cell reactions and becomes NADH. After passing those electrons onward, it can return to NAD+ and be used again. This carrier cycle links steps in fuel processing. Other enzymes consume NAD+ while doing jobs such as changing chemical tags on proteins.\n\nNAD+ SPRAY contains the molecule in a prepared liquid, but a liquid outside a cell is not the same as NAD+ available inside it. The research must establish the relevant chemistry and exposure in its own model. The spray label does not prove cell entry or improved energy production.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/nad-plus-spray", "type": "product"},
      {"label": "NAD+/NADH chemistry reference", "url": "https://pubchem.ncbi.nlm.nih.gov/compound/5892", "type": "reference", "note": "Official chemical reference for the electron-carrier cycle, not a study of this product."},
      {"label": "NAD-dependent protein-tag removal by Sir2 enzymes", "url": "https://pubmed.ncbi.nlm.nih.gov/10693811/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "semax-spray": {
    "name": "SEMAX SPRAY",
    "aliases": [],
    "summary": "A SEMAX solution for nerve-cell signaling research.",
    "what": "SEMAX SPRAY is a prepared liquid containing SEMAX. It is a different product from the non-spray form.",
    "study": "Researchers track BDNF and TrkB, parts of the system that regulates nerve-cell connections. The existing compound research does not establish the behavior of the prepared spray.",
    "how": "BDNF is a protein message involved in maintaining nerve cells and their connections. It activates a receptor called TrkB. Studies of SEMAX have measured changes in the amount of BDNF and the activity of TrkB in rat brain tissue. Those measurements identify a pathway worth investigating.\n\nThey do not show that SEMAX itself binds TrkB or reveal every step leading to the changes. The SPRAY format adds another question: whether the compound in this liquid remains intact and reaches the relevant target in the research setup. Parent-compound findings do not answer that formulation question.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/semax-spray", "type": "product"},
      {"label": "SEMAX: BDNF and TrkB measurements in rat hippocampus", "url": "https://pubmed.ncbi.nlm.nih.gov/16996037/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "selank-spray": {
    "name": "SELANK SPRAY",
    "aliases": [],
    "summary": "A SELANK solution for research on GABA-related nerve signals.",
    "what": "SELANK SPRAY is a prepared liquid containing SELANK. It is a different product from the non-spray form.",
    "study": "Research asks whether SELANK changes the way cells respond to GABA, a message that usually slows nerve-cell firing. The solution itself would require separate testing.",
    "how": "GABA acts as a brake in many nerve circuits. SELANK studies examine whether the peptide changes the response to that brake. Experiments measured changes in genes linked to GABA signaling, including a study in which the combination of SELANK and GABA differed from SELANK alone.\n\nThat does not establish direct activation of a GABA receptor or explain every reported response. SELANK SPRAY is the compound supplied in a liquid; the format does not prove that it reaches nerve cells or reproduces the experiments. Concentration and other solution ingredients are separate parts of the research question.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/selank-spray", "type": "product"},
      {"label": "SELANK and GABA-related gene activity", "url": "https://pubmed.ncbi.nlm.nih.gov/26924987/", "type": "paper", "note": "Compound research, not a test of this prepared solution."},
      {"label": "Cells exposed to SELANK alone and with GABA", "url": "https://pubmed.ncbi.nlm.nih.gov/28293190/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "pt-141-spray": {
    "name": "PT-141 SPRAY",
    "aliases": [],
    "summary": "A PT-141 solution for melanocortin nerve-signal research.",
    "what": "PT-141 SPRAY is a prepared liquid containing PT-141. It is a different product from the non-spray form.",
    "study": "The compound is studied in nerve circuits involved in sexual-response signaling. The purpose here is to explain the receptor route without claiming a result for the solution.",
    "how": "PT-141 can activate melanocortin receptors, including MC3 and MC4. These receiving points help pass messages within nerve cells. Early rat experiments measured activity in the hypothalamus, a brain region involved in automatic functions, after exposure to the compound. The research therefore examines a nerve-circuit route, not just local blood flow.\n\nThe SPRAY product adds no new proven mechanism. A prepared solution must be evaluated for its actual composition and exposure in the research model. Findings for another preparation of PT-141 do not show that this liquid has the same action or reaches the same target.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/pt-141-spray", "type": "product"},
      {"label": "PT-141: melanocortin receptors and nerve-circuit experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/12851303/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "melanotan-ii-spray": {
    "name": "Melanotan II Spray",
    "aliases": [],
    "summary": "A Melanotan II solution for melanocortin receptor research.",
    "what": "Melanotan II Spray is a prepared liquid containing Melanotan II. It is a different product from the non-spray form.",
    "study": "Experiments with the compound compare pigment-cell and nerve-cell responses at different receptors. Those separate responses should not be collapsed into a single claim about the spray.",
    "how": "Melanotan II resembles part of alpha-MSH, a natural signaling peptide. It can reach several melanocortin receptors. MC1 is involved in the cell machinery that makes melanin pigment; MC4 is involved in nerve signals. Receptor studies measure how strong and how long the internal messages last.\n\nMelanotan II Spray is a prepared liquid containing the compound, not evidence of delivery to any of those receptors. The same molecule can behave differently as concentration, cell type or surrounding solution changes. A spray format therefore cannot be used to infer a tanning, food-intake or other personal-use effect.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/melanotan-ii-spray", "type": "product"},
      {"label": "Melanotan II: timing of MC4 receptor signals", "url": "https://pubmed.ncbi.nlm.nih.gov/26418335/", "type": "paper", "note": "Compound research, not a test of this prepared solution."},
      {"label": "Melanotan II binding to MC1 in cell experiments", "url": "https://pubmed.ncbi.nlm.nih.gov/33073191/", "type": "paper", "note": "The cited work uses conjugated molecules in cell research, not this product or a personal-use application."}
    ]
  },
  "dsip-spray": {
    "name": "DSIP Spray",
    "aliases": [],
    "summary": "A DSIP solution for research on brain-message release.",
    "what": "DSIP Spray is a prepared liquid containing DSIP. It is a different product from the non-spray form.",
    "study": "Researchers have studied DSIP in sleep-related experiments and in the release of other brain peptides. No single established pathway explains all of those observations.",
    "how": "In a rat-brainstem experiment, DSIP increased release of another messenger called Met-enkephalin. The release depended on calcium, a common trigger for emptying a cell's stored message packets. DSIP did not directly bind opioid receptors in that study, so the observation suggests an indirect route rather than simple receptor substitution.\n\nThis does not explain a reliable sleep effect or establish the behavior of DSIP Spray. Its prepared liquid, concentration and target exposure are separate questions. The phrase delta sleep-inducing in DSIP's name reflects its research history; it is not a demonstrated function of this product.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/dsip-spray", "type": "product"},
      {"label": "DSIP and calcium-dependent peptide release in rat brainstem", "url": "https://pubmed.ncbi.nlm.nih.gov/2706459/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "bpc-tb-spray": {
    "name": "BPC-157/TB-500 Spray (Wolverine)",
    "aliases": [],
    "summary": "A two-peptide solution for cell-movement research.",
    "what": "BPC-157/TB-500 Spray (Wolverine) is a prepared liquid containing BPC-157 and TB-500. It is a different product from the non-spray form.",
    "study": "The ingredients are associated with research on cell movement and tissue responses. Both the mixture and the prepared liquid require evidence separate from studies of the ingredients.",
    "how": "BPC-157 research examines cell attachment proteins, which help cells grip and move along surfaces. Research on full thymosin beta-4 examines actin, the protein fibers that help cells reshape themselves. Those observations concern separate molecules and do not establish that their combination works as one coordinated system.\n\nThis product also comes as a prepared solution. The exact TB-500 form, the amount of each ingredient and the liquid around them can all matter. Neither a shared research topic nor a spray bottle proves stronger effects, a tissue-repair result, or a permitted route of use. The combined mechanism remains unestablished.",
    "limit": "Evidence from an individual peptide cannot establish the action of this mixture. Full thymosin beta-4 findings may not apply to a TB-500 fragment.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/bpc-tb-spray", "type": "product"},
      {"label": "BPC-157 attachment-protein experiment", "url": "https://pubmed.ncbi.nlm.nih.gov/21030672/", "type": "paper", "note": "Not a test of the blend or spray."},
      {"label": "Full thymosin beta-4 research", "url": "https://pubmed.ncbi.nlm.nih.gov/10469335/", "type": "paper", "note": "Not a test of this product’s exact TB-500 form or solution."}
    ]
  },
  "bpc-spray": {
    "name": "BPC-157 Spray",
    "aliases": [],
    "summary": "A BPC-157 solution for research on cell attachment and movement.",
    "what": "BPC-157 Spray is a prepared liquid containing BPC-157. It is a different product from the non-spray form.",
    "study": "Researchers study proteins that help cells grip a surface and move. The compound’s experimental effects and the prepared solution’s properties are separate things to test.",
    "how": "Cells move by repeatedly attaching to their surroundings, pulling forward and releasing their grip. In cultured rat tendon cells, BPC-157 was associated with changes in FAK and paxillin, proteins involved in those attachment points, and with increased cell movement. This is one concrete line of research behind the compound.\n\nIt does not identify a complete repair mechanism. Nor does it establish that BPC-157 Spray acts like the material in that experiment. The liquid's composition and the amount of intact compound reaching cells must be evaluated separately. The name Spray is a product format, not an instruction for administration.",
    "limit": "Compound research is not a test of this solution. The format does not establish delivery, a personal-use route or a health benefit.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/bpc-spray", "type": "product"},
      {"label": "BPC-157: tendon-cell movement and attachment proteins", "url": "https://pubmed.ncbi.nlm.nih.gov/21030672/", "type": "paper", "note": "Compound research, not a test of this prepared solution."},
      {"label": "BPC-157 experimental ligament model", "url": "https://pubmed.ncbi.nlm.nih.gov/20225319/", "type": "paper", "note": "Compound research, not a test of this prepared solution."}
    ]
  },
  "adalank-spray": {
    "name": "Adalank Spray",
    "aliases": ["N acetyl Selank amidate"],
    "summary": "A modified SELANK peptide with an unconfirmed mechanism.",
    "what": "Adalank Spray contains a modified SELANK peptide. The partner identifies it as N-acetyl Selank amidate, meaning small chemical groups cap both ends of the chain.",
    "study": "The product is designed around SELANK-related research on GABA signaling. A central research question is whether the altered peptide keeps any of the parent compound’s behavior.",
    "how": "The partner identifies Adalank as SELANK with small chemical caps at both ends. Capping can change how a peptide is broken down, but the change must be tested for this molecule. It cannot be assumed to last longer or reach a particular tissue.\n\nThe proposed biological direction comes from SELANK research: whether it changes how nerve cells respond to GABA, a message that often slows firing. Direct studies establishing Adalank's own target-to-effect chain were not identified in this review. The caps explain the design idea; parent-compound studies do not establish what the modified peptide actually does.",
    "limit": "The parent compound is not Adalank. Its claimed stability and GABA-related action need direct evidence; neither is proved by the spray format.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/adalank-spray", "type": "product"},
      {"label": "SELANK and GABA cell experiment", "url": "https://pubmed.ncbi.nlm.nih.gov/28293190/", "type": "paper", "note": "Parent SELANK only. This is not direct evidence for Adalank."}
    ]
  },
  "adamax-spray": {
    "name": "Adamax Spray",
    "aliases": ["Ac MEHFPGPAG"],
    "summary": "A modified SEMAX peptide with an unconfirmed mechanism.",
    "what": "Adamax Spray contains a modified SEMAX-like peptide. The partner describes an acetylated chain with nine amino acids, compared with seven in SEMAX.",
    "study": "The design follows SEMAX-related research on BDNF and nerve-cell connections. Researchers would need to establish whether the altered molecule produces the same signals before assigning it the parent’s mechanism.",
    "how": "The partner describes Adamax as a SEMAX-like chain with two extra amino acids and a chemical cap at one end. Such changes can affect a peptide's shape and breakdown, but they can also alter what it binds. Similarity does not establish the same function or a stronger one.\n\nThe proposed direction comes from SEMAX studies measuring BDNF, a nerve-cell growth message, and its receptor TrkB. Direct evidence showing how Adamax starts or changes that pathway was not identified in this review. Its actual mechanism is therefore unknown, rather than a confirmed longer-lasting version of SEMAX's reported effects.",
    "limit": "SEMAX is the parent compound, not a substitute source of proof. No increased stability, brain delivery or personal-use benefit is established here for Adamax.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/adamax-spray", "type": "product"},
      {"label": "SEMAX BDNF and TrkB experiment", "url": "https://pubmed.ncbi.nlm.nih.gov/16996037/", "type": "paper", "note": "Parent SEMAX only. This is not direct evidence for Adamax."}
    ]
  },
};
