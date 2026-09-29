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
  /** Short, plain-language explanation with its evidence boundary. */
  plain: string;
  /** Two short paragraphs: target/action, then consequence and evidence boundary. */
  how: string;
  limit: string;
  sources: readonly { label: string; url: string; type: "product" | "paper" | "reference"; note?: string }[];
}
export const PRODUCT_RESEARCH: Readonly<Record<string, ProductResearch>> = {
  "amino-h2o": {
    "name": "Amino H2O",
    "aliases": ["BAC water", "bacteriostatic water", "H2O"],
    "summary": "Whether a lab sample dissolves in this water and stays unchanged.",
    "what": "Amino H2O is water with 0.9% benzyl alcohol, a preservative. It is a lab supply, not a peptide.",
    "study": "The question is whether a liquid is compatible with a particular laboratory sample. Dissolving a compound, limiting bacterial growth and confirming sterility are separate checks.",
    "plain": "Water holds compounds that can dissolve in it. Benzyl alcohol slows bacterial growth, but does not sterilize contaminated material. Neither ingredient establishes whether this liquid is compatible with a specific sample.",
    "how": "Water molecules surround and separate parts of a compound that can dissolve in water. That lets the material spread through the liquid instead of remaining a dry powder. Whether a particular compound dissolves and stays intact depends on its chemistry.\n\nThe added benzyl alcohol is a preservative that slows bacterial growth in the liquid. It is not a filter, does not remove toxins, and does not turn contaminated material into a sterile sample. Water and preservative do different jobs: one holds the sample; the other limits microbial growth.",
    "limit": "The preservative does not prove sterility or compatibility. Use the supplier label and an appropriate laboratory protocol to establish those separately.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/amino-h2o", "type": "product"}
    ]
  },
  "glp-1": {
    "name": "GLP-1 (SM)",
    "aliases": ["Semaglutide", "SM", "glp1"],
    "summary": "How a lab-made message changes what a cell does when sugar is present.",
    "what": "GLP-1 (SM) is a lab-made peptide. A peptide is a chain of small building blocks called amino acids.",
    "study": "Researchers test how the semaglutide molecule interacts with GLP-1 receptors, which receive chemical messages at the cell surface. Molecular-design studies also examine how it resists breakdown and binds to a carrier protein.",
    "plain": "Semaglutide mimics a natural signal received by the GLP-1 receptor. Experiments examine the resulting cell messages and the molecule's structure. Those findings describe a studied compound, not the identity or performance of a supplier's vial.",
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
    "summary": "How one lab-made message acts through two different proteins on cells.",
    "what": "GLP-2 (TR) is the partner’s name for tirzepatide. It is a peptide, a small chemical chain with 39 building blocks called amino acids.",
    "study": "Researchers compare tirzepatide's activity at GIP and GLP-1 receptors. The question is how one molecule interacts with two receiving points, and how the responses differ between experimental systems.",
    "plain": "Tirzepatide can activate two kinds of cell receptors: GIP and GLP-1. Activity at one does not imply an equal response at the other. GLP-2 (TR) is the supplier's product name, not the name of the natural GLP-2 hormone.",
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
    "summary": "How one molecule starts three different kinds of messages in cells.",
    "what": "GLP-3 (RT) is the partner’s name for retatrutide. It is a peptide, a small chemical chain with 39 building blocks called amino acids.",
    "study": "Researchers measure retatrutide's activity at GIP, GLP-1 and glucagon receptors. They examine each pathway separately because three receptor targets do not represent three interchangeable effects.",
    "plain": "Retatrutide interacts with three cell-signaling pathways. Each receptor passes on a different message, so counting targets cannot predict the combined response. These molecular studies do not establish results for a purchased research product.",
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
    "summary": "How cells grip a surface and move across it in a lab test.",
    "what": "BPC-157 is a lab-made chain of 15 amino acids, the small building blocks of peptides.",
    "study": "Researchers examine how tendon cells attach, move and change their internal signals in laboratory experiments. Measurements include FAK and paxillin, proteins involved in the connection between a cell and its surroundings.",
    "plain": "Experiments with cultured rat tendon cells measured changes in attachment-related proteins after exposure to BPC-157. That is evidence about a laboratory cell response, not proof of tissue repair. The molecule's first binding target remains unresolved.",
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
    "summary": "How a copper-holding chain affects the support that cells build around them.",
    "what": "GHK-Cu is a chain of three amino acids joined to copper. The letters name the three building blocks; Cu means copper.",
    "study": "Researchers examine how the GHK peptide binds copper and how cells change proteins in the material around them. This surrounding material, called the extracellular matrix, helps give tissue its structure.",
    "plain": "GHK holds a copper ion. Laboratory studies examine changes in collagen and other components of the framework around cells. The compound is not replacement collagen, and those experiments do not establish an effect from this supplier's product.",
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
    "summary": "How a related molecule changes the inner frame that helps a cell move.",
    "what": "TB-500 names products related to a peptide called thymosin beta-4. A peptide is a small chemical chain. The exact chain can differ between products.",
    "study": "Research on full-length thymosin beta-4 examines actin, a protein that forms part of a cell's internal framework. A key question is whether a TB-500 product contains that same molecule or a different fragment.",
    "plain": "Full-length thymosin beta-4 interacts with actin, which helps cells maintain shape and move. TB-500 can refer to different related forms. Findings for the full molecule cannot automatically be assigned to a fragment or an unverified product.",
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
    "summary": "How a copied message makes a small gland release a stored hormone.",
    "what": "Tesamorlin is the partner’s spelling for tesamorelin. It is a small chemical chain that copies a message involved in hormone release. A hormone is a chemical message.",
    "study": "Researchers examine the interaction between a GHRH-like molecule and receptors on pituitary cells. The focus is on the signal that precedes hormone release, not on supplying growth hormone itself.",
    "plain": "Tesamorelin resembles a message received by the pituitary gland, a small hormone-signaling organ. Research measures the response to that message. Tesamorlin is the supplier's spelling; the compound is not growth hormone itself.",
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
    "summary": "How cells change their chemical work when their fuel supply changes.",
    "what": "MOTS-C is a 16-part peptide linked to mitochondria, the tiny structures that help cells release energy from fuel.",
    "study": "Researchers examine how cells detect changes in available fuel. Studies of MOTS-c track molecules such as AICAR and AMPK, which participate in the cell's response to its energy conditions.",
    "plain": "MOTS-c research examines signals that help cells respond to changing fuel availability. AICAR and AMPK are parts of that signaling network. Measurements in experimental models do not establish an energy or performance benefit from a research product.",
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
    "summary": "How cells reuse a small chemical helper while they process fuel.",
    "what": "NAD+ is a small chemical found inside cells, the tiny living parts of tissue. It helps some chemical reactions happen. It is not a peptide.",
    "study": "Researchers examine how NAD participates in electron-transfer reactions and how enzymes consume it. A separate question is whether NAD outside a cell becomes available inside that cell.",
    "plain": "NAD carries electrons between chemical reactions, changing between NAD+ and NADH. Some enzymes also use it as a starting material. Finding NAD in a liquid does not establish that it reaches the inside of cells.",
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
    "summary": "How two ingredients start different messages in a hormone-releasing gland.",
    "what": "This blend contains CJC-1295 without DAC and Ipamorelin, two small chemical chains. No DAC means this CJC form lacks an added part found in another version.",
    "study": "Researchers study GHRH-receptor and ghrelin-receptor signals separately. For this blend, ingredient identity and the No DAC form matter because evidence from a different CJC form does not establish the same behavior.",
    "plain": "The two ingredients are associated with different receiving points on pituitary cells. No DAC means the CJC component lacks the albumin-binding group used in DAC forms. Studies of individual compounds do not prove the blend's combined response or duration.",
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
    "summary": "How a tiny chain enters cells and changes some of their alarm messages.",
    "what": "KPV is a tiny chemical chain with three building blocks, called amino acids. Their names are lysine, proline and valine.",
    "study": "Researchers examine how KPV enters certain cells and how experimental signaling markers change. Studies include PepT1, a transport protein, and NF-kappa B, a system involved in switching on cellular-response genes.",
    "plain": "KPV is a chain of three amino acids. Some experiments link its entry into cells to a transporter called PepT1, then measure changes in cell-response signals. This is a proposed experimental pathway, not evidence of a treatment effect.",
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
    "summary": "How four separate ingredients relate to cell movement, support and alarm messages.",
    "what": "KLOW combines BPC-157, TB-500, GHK-Cu and KPV. Each is a separate compound within the same product.",
    "study": "The ingredients are BPC-157, TB-500, GHK-Cu and KPV. Their papers examine different cell processes; the important unanswered question is how the exact four-part mixture behaves when studied as one formulation.",
    "plain": "KLOW combines four named ingredients, not four proven outcomes. Research on each ingredient does not establish how the mixture works. Its composition and proportions must come from the label, and the finished blend requires its own evidence.",
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
    "summary": "How a short chain changes messages that help nerve cells form connections.",
    "what": "SEMAX is a small lab-made chemical chain. Its seven building blocks are called amino acids. Its design copies part of another chain called ACTH.",
    "study": "Researchers measure changes in BDNF and TrkB, proteins involved in nerve-cell signaling. The cited rat-brain research examines these markers, not a demonstrated effect on human thinking or memory.",
    "plain": "Studies measured changes in a signaling protein called BDNF and its receptor, TrkB, after Semax exposure in an experimental model. That does not establish that Semax binds directly to TrkB, or that the same findings apply to a supplier's product.",
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
    "summary": "How cells change certain harmful chemicals into less reactive ones.",
    "what": "Glutathione is a small chemical chain that cells make. Cells are the tiny living parts of tissue. They use this chain in several chemical jobs.",
    "study": "Researchers examine the chemical cycle between reduced glutathione, GSH, and its oxidized form, GSSG. They measure how enzymes use and replenish these forms during reactions involving peroxides.",
    "plain": "Glutathione participates in reactions that convert peroxides into other substances. It changes chemical form in the process and can be recycled by an enzyme system. That cellular chemistry does not establish a detoxification benefit from a product.",
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
    "summary": "How a ring-shaped chain starts different kinds of messages in cells.",
    "what": "Melanotan II is a small lab-made chemical chain shaped like a ring. It copies parts of a natural message called alpha-MSH.",
    "study": "Researchers compare responses at several melanocortin receptors, including MC1 and MC4. These receiving points occur in different biological systems, so an observation at one target cannot describe the molecule's entire activity.",
    "plain": "Melanotan II resembles part of a natural cell message but can interact with more than one melanocortin receptor. Different receptors trigger different signals. Its ring-shaped structure and multiple targets distinguish it from Melanotan I.",
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
    "summary": "How three separate ingredients relate to cell movement and cell support.",
    "what": "GLOW contains three compounds: BPC-157, TB-500 and GHK-Cu. It is not the four-compound KLOW blend.",
    "study": "GLOW contains BPC-157, TB-500 and GHK-Cu. Researchers would need to test this exact combination to determine its behavior; separate ingredient papers cannot answer questions about the finished formulation.",
    "plain": "GLOW combines three ingredients and does not include the KPV found in KLOW. Each ingredient has a separate research background. Combining them does not establish a shared mechanism, an additive response or a proven outcome for the blend.",
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
    "summary": "Whether a short chain changes how nerve-like cells respond to a stop message.",
    "what": "SELANK is a small lab-made chemical chain with seven building blocks called amino acids. Its design is based on another chain called tuftsin.",
    "study": "Researchers measure gene activity associated with GABA, a chemical messenger between nerve cells. Studies distinguish Selank alone from Selank combined with GABA because those are different experimental conditions.",
    "plain": "Selank research includes changes in GABA-related gene activity. A response observed with GABA present does not establish the same response to Selank alone. These measurements also do not prove that Selank binds directly to a GABA receptor.",
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
    "summary": "How a copied message starts chemical steps in pigment cells.",
    "what": "Melanotan I is a small lab-made chemical chain. It copies parts of a natural message called alpha-MSH. It differs from ring-shaped Melanotan II.",
    "study": "Researchers examine MC1-receptor activity and downstream cell signals involved in pigment biology. The research question concerns a receptor pathway, not a demonstrated cosmetic result from a supplier's formulation.",
    "plain": "Melanotan I is a linear peptide related to the natural alpha-MSH signal. MC1-receptor experiments examine messages passed inside pigment-producing cells. It is structurally different from ring-shaped Melanotan II, and the two should not be treated as interchangeable.",
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
    "summary": "How a changed growth message stays free to reach cells in a lab test.",
    "what": "IGF-1 LR3 is a changed copy of IGF-1, a chemical message involved in cell growth. It has an added piece and one changed building block.",
    "study": "Researchers compare how modified IGF-1 interacts with receptors and with proteins that bind IGF. The amount of binding protein in a cell experiment can change how much of the compound is available.",
    "plain": "IGF-1 LR3 has changes that reduce its interaction with certain IGF-binding proteins. Those proteins normally affect how much IGF is available to cells. A different response in culture does not necessarily mean stronger receptor binding.",
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
    "summary": "What changes when a compound slows one chemical job inside cells.",
    "what": "5-Amino-1MQ is a small chemical compound, not a peptide. Researchers study whether it slows a protein called NNMT that helps change one chemical into another.",
    "study": "Researchers test whether 5-amino-1MQ inhibits NNMT, an enzyme that changes nicotinamide into another molecule. Enzyme activity and downstream cellular measurements are separate from any claimed personal benefit.",
    "plain": "NNMT is an enzyme that carries out a chemical conversion involving nicotinamide. 5-amino-1MQ is studied for interference with that reaction. It is a small molecule, not a peptide, and enzyme inhibition alone does not establish a product outcome.",
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
    "summary": "How two separate ingredients relate to the way cells move.",
    "what": "This product combines BPC-157 and TB-500. Wolverine is the partner’s name for this two-compound blend.",
    "study": "BPC-157 and TB-500 have different research backgrounds. Studies examine attachment-related cell signals or actin biology, but the exact TB-500 form and the behavior of the combined mixture must be established separately.",
    "plain": "The Wolverine blend combines BPC-157 and TB-500. Evidence about one ingredient does not validate the other or prove a combined effect. Research on full thymosin beta-4 also cannot automatically describe every product sold as TB-500.",
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
    "summary": "How a copied chemical message changes activity in linked nerve cells.",
    "what": "PT-141 is a small lab-made chemical chain shaped like a ring. It copies parts of a natural message called alpha-MSH.",
    "study": "Researchers examine melanocortin receptors, especially MC3 and MC4, in experimental nerve-signaling systems. Studies ask which receptors and circuits contribute to an observed response, rather than assuming one simple pathway.",
    "plain": "PT-141 is related to a natural melanocortin message. Research examines how it interacts with receptors involved in nerve signaling. A response in a studied circuit does not establish the effects, safety or identity of a commercial research product.",
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
    "summary": "How a chemical message fits a cell protein with added helper parts.",
    "what": "Cagrilintide is a changed copy of amylin, a natural chemical message. It is a chain of 37 small building blocks called amino acids.",
    "study": "Researchers compare activity at receptor combinations formed by a calcitonin receptor and helper proteins. These combinations help explain why amylin-related signaling is different from the GLP-1 pathway.",
    "plain": "Cagrilintide resembles amylin, a natural signaling peptide. Its receptor system includes a main receptor and helper proteins that influence the response. It is not a GLP-1 compound, and findings from one pathway cannot substitute for evidence about the other.",
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
    "summary": "Whether a small copied part of a hormone changes fat-cell chemistry.",
    "what": "AOD-9604 is a small lab-made chemical chain based on part of growth hormone. A hormone is a chemical message. This chain is not the whole hormone.",
    "study": "Researchers examine this modified growth-hormone fragment in experimental models, including measurements of fat-cell chemistry and beta-3-receptor-related pathways. These measurements do not establish a complete or confirmed mechanism.",
    "plain": "AOD-9604 resembles a small part of growth hormone, not the entire hormone. Animal experiments have examined possible links to fat-cell signaling. Its precise mechanism remains unresolved, so these observations should not be presented as a proven product effect.",
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
    "summary": "Whether a short chemical chain changes the messages released by nerve tissue.",
    "what": "DSIP is a small chemical chain with nine building blocks called amino acids. This kind of short chain is called a peptide.",
    "study": "Researchers investigate experimental nerve-signaling observations associated with DSIP. Its historical name refers to sleep, but a name is not evidence of a confirmed sleep-related action or a defined receptor target.",
    "plain": "DSIP's first molecular target has not been firmly established. Some rat-tissue experiments measured release of a nerve-signaling molecule called Met-enkephalin. That observation does not prove direct opioid-receptor binding or establish a sleep effect for this product.",
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
    "summary": "Whether a short chain changes the ends of a cell’s stored instructions.",
    "what": "Epithalon is a small lab-made chemical chain with four building blocks called amino acids. This kind of short chain is called a peptide.",
    "study": "Researchers measure telomerase activity and telomeres, the repeated DNA sequences at chromosome ends, in cultured cells. These are laboratory measurements, not demonstrations of longer life or an anti-aging effect.",
    "plain": "Cell-culture studies examine markers associated with chromosome ends after Epithalon exposure. The initial molecular interaction remains uncertain. Changes in those markers do not establish effects on lifespan or validate a supplier's research product.",
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
    "summary": "How a short chemical message makes gland cells release a stored hormone.",
    "what": "Ipamorelin is a small lab-made chemical chain with five building blocks called amino acids. This kind of short chain is called a peptide.",
    "study": "Researchers examine how ipamorelin interacts with the ghrelin receptor, also called GHS-R. This signal is distinct from the GHRH-receptor pathway, even though both are studied in pituitary signaling.",
    "plain": "Ipamorelin interacts with a receptor that receives ghrelin-related messages. Experiments measure the downstream signaling response. It is not growth hormone itself, and its pathway should not be confused with the different receptor used by GHRH-like peptides.",
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
    "summary": "Whether a small copy of a protein part could change how cells release messages.",
    "what": "SNAP-8 is a small lab-made chemical chain with eight building blocks. It copies a piece of a protein called SNAP-25 that helps cells release messages.",
    "study": "The cited background research examines SNAP-25 and SNARE proteins, which help cells release packets of chemical messages. It explains the proposed mechanism's context but is not direct testing of SNAP-8.",
    "plain": "SNAP-8 resembles a short piece of SNAP-25, part of the machinery cells use to release chemical messages. Interference with that machinery is a proposed explanation. The linked background papers do not demonstrate that SNAP-8 itself produces that response.",
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
    "summary": "How some cells detect a trigger and tell other cells about it.",
    "what": "Thymosin Alpha-1 is a lab-made copy of a peptide, or small chemical chain. It has 28 building blocks called amino acids.",
    "study": "Researchers examine how dendritic cells, which help detect and present biological material, change their signals. Studies include Toll-like-receptor pathways and IL-12, rather than a general claim of stronger immunity.",
    "plain": "Thymosin alpha-1 research measures how certain immune cells respond in experimental conditions. These responses depend on the cell type and signals already present. A change in an immune marker does not establish an immune benefit from a supplier's product.",
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
    "summary": "How a short chain can make openings in a cell’s outer barrier.",
    "what": "LL-37 is a chemical chain with 37 building blocks called amino acids. Researchers study its role in how cells respond to microbes, such as bacteria.",
    "study": "Researchers examine interactions between LL-37 and cell membranes, as well as signals in non-microbial cells. The experimental conditions matter because membrane effects are not restricted to one type of cell.",
    "plain": "LL-37 has a positive charge that contributes to its interaction with membranes. Laboratory studies examine both membrane disruption and cell signaling. Those observations do not establish selective activity, safety or an antibiotic effect for this product.",
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
    "summary": "Whether a short chain changes which built-in instructions a cell reads.",
    "what": "Cartalax is a small lab-made chemical chain with three building blocks called amino acids. Their names are shortened to AED.",
    "study": "Researchers examine changes in IGF-1-related gene activity in cultured cells exposed to the AED peptide. Proposed interactions with DNA remain a hypothesis rather than a fully established mechanism.",
    "plain": "Cartalax is associated with the short peptide AED. Cell experiments measured changes in gene activity, but the first molecular interaction is not settled. Those findings do not demonstrate cartilage formation or a tissue-level outcome.",
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
    "summary": "How a short copy of a natural message can trigger hormone release.",
    "what": "Sermorelin is a small chemical chain that copies part of GHRH, a message involved in hormone release. It has 29 building blocks called amino acids.",
    "study": "Researchers examine the active section of GHRH, a natural message received by pituitary cells. The question concerns receptor signaling, not whether a research vial supplies growth hormone or has a demonstrated personal effect.",
    "plain": "Sermorelin contains the active end of the GHRH message. That message is received by pituitary-cell receptors and starts a signaling sequence. It is distinct from growth hormone itself, and molecular background does not validate a supplier's vial.",
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
    "summary": "How one nerve-cell message starts the next message in a chain.",
    "what": "The partner’s Kisspeptin is a small chemical chain that can act as a message. This product lists the 10-building-block form.",
    "study": "Researchers examine how kisspeptin activates KISS1R and how that signal connects to GnRH and later hormone measurements. The exact kisspeptin form matters when comparing experiments.",
    "plain": "Kisspeptin starts a signaling sequence at a receptor called KISS1R. Downstream measurements may involve several additional hormones, so they are not all direct actions of the peptide. Research on this pathway does not establish a reproductive benefit from a product.",
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
    "summary": "An idea about nerve-cell connections whose key supporting paper was withdrawn.",
    "what": "Dihexa is a small lab-made chemical. Its design is based on a piece of another chemical chain called angiotensin IV. Its proposed action remains uncertain.",
    "study": "A proposed connection to HGF and the c-Met receptor has been discussed in Dihexa research. A key 2014 mechanism paper was retracted in 2025, so it cannot be treated as reliable confirmation of that explanation.",
    "plain": "Dihexa's proposed HGF/c-Met mechanism is not established by the cited retracted paper. The retraction is an evidence warning, not a positive finding. We do not present that mechanism as a demonstrated action of this product.",
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
    "summary": "How one chemical message changes salt and fluid movement in certain cell tests.",
    "what": "VIP is a chemical chain with 28 building blocks called amino acids. It carries messages between cells, the tiny living parts of tissue.",
    "study": "Researchers examine VIP activity at VPAC1 and VPAC2 receptors and the resulting intracellular messenger, cAMP. Different experimental systems measure fluid-related cell signals or smooth-muscle responses.",
    "plain": "VIP carries a message to receptors called VPAC1 and VPAC2. These receptors can increase cAMP, a messenger inside cells. What happens next depends on the tissue and experimental conditions, rather than a single universal effect.",
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
    "summary": "Whether a small copied piece of a signal protein changes a cell’s stress response.",
    "what": "ARA-290 is a small lab-made chemical chain with 11 building blocks. It copies a surface piece of a larger signal protein called EPO.",
    "study": "Researchers examine a proposed receptor complex involving the erythropoietin receptor and CD131. The question is whether this fragment engages a signaling pathway distinct from the one associated with red-blood-cell production.",
    "plain": "ARA-290 is a small fragment based on erythropoietin, not the full protein. Research proposes a different receptor arrangement for some observed responses. That proposal does not establish tissue repair or a confirmed effect of this supplier's product.",
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
    "summary": "How cells respond when chemicals that can damage their parts build up.",
    "what": "Pinealon is a small lab-made chemical chain with three building blocks called amino acids. Their names are shortened to EDR.",
    "study": "Researchers measure reactive oxygen species and ERK signaling in experimental cells. These are indicators of cellular conditions; they do not by themselves identify Pinealon's first target or establish a tissue-level effect.",
    "plain": "Pinealon research tracks changes in cell-stress markers and signaling proteins. The initial molecular interaction remains unclear. A change in a laboratory marker is not the same as demonstrating a cognitive or protective benefit.",
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
    "summary": "How a copper-holding chain affects lab-grown cells from the base of a hair.",
    "what": "AHK-Cu joins three amino acids to copper. Its first building block differs from GHK-Cu, so they are not the same molecule.",
    "study": "Researchers examine cultured dermal papilla cells and isolated follicles, including measurements of cell-survival-related proteins. These model-specific findings are not demonstrations of a cosmetic result from this formulation.",
    "plain": "AHK-Cu binds copper and differs from GHK-Cu by one amino acid. Laboratory studies measured responses in follicle-related cells, with limits on which results were statistically supported. They do not establish a hair-growth effect for a supplier's product.",
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
    "summary": "How a copper-holding chain affects the support that cells build around them. The prepared liquid is a separate research question.",
    "what": "GHK-Cu SPRAY is a prepared liquid containing GHK-Cu. It is a different product from the non-spray form.",
    "study": "The cited research concerns GHK-Cu and cell-matrix chemistry, not testing of this prepared spray. Separate formulation studies would be needed to establish the liquid's stability and behavior.",
    "plain": "The parent peptide binds copper, and laboratory research examines changes in the framework around cells. Putting it in a prepared liquid introduces separate formulation questions. Parent-compound evidence does not demonstrate the spray's delivery, stability or effects.",
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
    "summary": "How cells reuse a small chemical helper while they process fuel. The prepared liquid is a separate research question.",
    "what": "NAD+ SPRAY is a prepared liquid containing NAD+. It is a different product from the non-spray form.",
    "study": "The research background concerns NAD's role in chemical reactions within cells. For a prepared liquid, an additional question is whether the molecule remains intact and becomes available in the experimental system.",
    "plain": "NAD participates in electron-transfer reactions inside cells. Its presence in a spray does not establish that it reaches those cells or participates in the same reactions. The finished liquid needs evidence separate from NAD's basic chemistry.",
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
    "summary": "How a short chain changes messages that help nerve cells form connections. The prepared liquid is a separate research question.",
    "what": "SEMAX SPRAY is a prepared liquid containing SEMAX. It is a different product from the non-spray form.",
    "study": "The cited rat-brain research examines Semax-related BDNF and TrkB measurements. It does not test this supplier's spray or establish that the liquid reproduces those experimental conditions.",
    "plain": "Parent-compound research measured nerve-signaling markers after Semax exposure. It did not validate this prepared spray. The formulation's composition, stability and delivery must be evaluated separately rather than inferred from the peptide's name.",
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
    "summary": "Whether a short chain changes how nerve-like cells respond to a stop message. The prepared liquid is a separate research question.",
    "what": "SELANK SPRAY is a prepared liquid containing SELANK. It is a different product from the non-spray form.",
    "study": "The cited experiments examine Selank and GABA-related gene activity under specific laboratory conditions. They do not establish the behavior of this spray or show that it works like GABA itself.",
    "plain": "Selank research includes measurements of GABA-related signals, not a confirmed simple receptor mechanism. Those findings concern the studied compound and conditions. They do not establish how this prepared liquid behaves or reaches an experimental target.",
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
    "summary": "How a copied chemical message changes activity in linked nerve cells. The prepared liquid is a separate research question.",
    "what": "PT-141 SPRAY is a prepared liquid containing PT-141. It is a different product from the non-spray form.",
    "study": "The background studies examine melanocortin receptors and nerve-signaling circuits. The supplier's spray would need its own evidence; studies of the parent compound do not establish the finished liquid's behavior.",
    "plain": "PT-141 research focuses on melanocortin signaling, including MC3 and MC4 receptors. A prepared spray is a separate formulation. The parent compound's research does not demonstrate this liquid's stability, delivery or effects.",
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
    "summary": "How a ring-shaped chain starts different kinds of messages in cells. The prepared liquid is a separate research question.",
    "what": "Melanotan II Spray is a prepared liquid containing Melanotan II. It is a different product from the non-spray form.",
    "study": "Researchers study the parent peptide at multiple melanocortin receptors. The exact prepared liquid is a different research question because formulation and delivery are not established by receptor studies.",
    "plain": "Melanotan II can interact with several melanocortin receptors in experimental systems. Those observations concern the studied molecule. They do not establish which responses, if any, occur with this supplier's prepared spray.",
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
    "summary": "Whether a short chemical chain changes the messages released by nerve tissue. The prepared liquid is a separate research question.",
    "what": "DSIP Spray is a prepared liquid containing DSIP. It is a different product from the non-spray form.",
    "study": "The background research concerns limited DSIP nerve-signaling observations. Neither the historical sleep-related name nor those experiments establish a mechanism or result for this prepared spray.",
    "plain": "The parent peptide's initial target remains uncertain. A spray format does not resolve that uncertainty or establish a sleep-related action. Both the molecule's proposed mechanism and the finished liquid's behavior require separate evidence.",
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
    "summary": "How two separate ingredients relate to the way cells move. The prepared liquid is a separate research question.",
    "what": "BPC-157/TB-500 Spray (Wolverine) is a prepared liquid containing BPC-157 and TB-500. It is a different product from the non-spray form.",
    "study": "The ingredients have separate research backgrounds involving cell attachment and actin biology. The exact TB-500 form, combined mixture and prepared liquid each introduce questions not answered by individual-compound papers.",
    "plain": "This spray combines BPC-157 and TB-500 in a liquid. Ingredient studies do not prove how the blend behaves, and full thymosin beta-4 research may not describe the TB-500 form supplied. The finished formulation needs its own testing.",
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
    "summary": "How cells grip a surface and move across it in a lab test. The prepared liquid is a separate research question.",
    "what": "BPC-157 Spray is a prepared liquid containing BPC-157. It is a different product from the non-spray form.",
    "study": "The cited studies examine BPC-157 in experimental cell systems, including attachment-related signals. They do not test this prepared spray or establish that its formulation recreates the studied conditions.",
    "plain": "Cultured-cell studies measured attachment and movement-related signals after BPC-157 exposure. They do not establish this spray's behavior or delivery. The parent compound's first binding target also remains unresolved.",
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
    "summary": "How changes to a Selank-like peptide might change the molecule’s behavior.",
    "what": "Adalank Spray is a prepared liquid with a changed form of SELANK, a small chemical chain. Extra chemical pieces cap the chain’s ends. It needs its own evidence.",
    "study": "Adalank changes the ends of the Selank-related peptide. The central question is how those changes affect the exact molecule; research on unmodified Selank cannot answer that by itself.",
    "plain": "Adalank is not simply another name for Selank. Chemical changes at the peptide's ends create a different compound. A direct mechanism has not been established by the cited parent research, which also does not validate the spray's stability or delivery.",
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
    "summary": "How changing a Semax-like peptide could affect its shape and behavior.",
    "what": "Adamax Spray is a prepared liquid with a chain based on SEMAX. It has added building blocks and a chemical cap. Those changes make it a separate research question.",
    "study": "Adamax differs from Semax in both length and chemical modification. Research needs to address that exact structure and the prepared liquid, rather than transferring results from the shorter parent peptide.",
    "plain": "Adamax contains a modified, extended Semax-related sequence. Those changes mean it cannot be assumed to behave like Semax. The cited parent-compound studies do not establish a direct mechanism or validate this spray's formulation.",
    "how": "The partner describes Adamax as a SEMAX-like chain with two extra amino acids and a chemical cap at one end. Such changes can affect a peptide's shape and breakdown, but they can also alter what it binds. Similarity does not establish the same function or a stronger one.\n\nThe proposed direction comes from SEMAX studies measuring BDNF, a nerve-cell growth message, and its receptor TrkB. Direct evidence showing how Adamax starts or changes that pathway was not identified in this review. Its actual mechanism is therefore unknown, rather than a confirmed longer-lasting version of SEMAX's reported effects.",
    "limit": "SEMAX is the parent compound, not a substitute source of proof. No increased stability, brain delivery or personal-use benefit is established here for Adamax.",
    "sources": [
      {"label": "Partner product information", "url": "https://www.aminoclub.com/us/products/adamax-spray", "type": "product"},
      {"label": "SEMAX BDNF and TrkB experiment", "url": "https://pubmed.ncbi.nlm.nih.gov/16996037/", "type": "paper", "note": "Parent SEMAX only. This is not direct evidence for Adamax."}
    ]
  },
};
