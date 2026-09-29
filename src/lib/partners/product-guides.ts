import { PRODUCT_RESEARCH } from "./product-content";
import { type SupplierProduct } from "./supplier-catalog";

/** Plain-language reading layer. The reviewed source records remain in product-content.
 * A study summary describes the cited experiment, never a test of a partner vial.
 * Entries are editorial explanations, not individualized product recommendations.
 */
export interface ProductGuide {
  study:string;
  how:string;
  steps:readonly [string,string];
  finding:string;
  model:string;
  paper:string;
  caution:string;
}
const pubmed=(id:string)=>`https://pubmed.ncbi.nlm.nih.gov/${id}/`;
function guide(study:string,how:string,first:string,second:string,finding:string,model:string,paper:string,caution:string):ProductGuide {
  return {study,how,steps:[first,second],finding,model,paper:paper?pubmed(paper):"",caution};
}
const base:Record<string,ProductGuide>={
 "amino-h2o":guide(
  "Whether this water is a good match for a lab sample.",
  "Water can hold a compound that dissolves in it. A preservative called benzyl alcohol slows the growth of bacteria. It does not make dirty water clean or prove that every compound will stay stable.",
  "Think of sugar dissolving in water: the sugar spreads through the liquid. Lab compounds do not all act like sugar. Some will not dissolve well. Others may change after they dissolve.",
  "The water and its preservative do different jobs. The water holds the sample. The preservative limits bacterial growth. A lab still needs separate checks for a good match, a clean sample and how long the compound stays intact.",
  "The partner describes water with 0.9% benzyl alcohol. This is product information, not a study showing that it works with every peptide.","Partner product information","","A preservative does not remove all germs or make every sample suitable for research."),
 "glp-1":guide(
  "How one lab-made signal attaches to a cell and passes on a message.",
  "Cells have receiving points called receptors. Semaglutide can switch on one called GLP-1. Think of a message reaching the right mailbox. Researchers study the message that follows, not just whether the molecule fits.",
  "GLP-1 is the name of a natural cell message and the receptor that receives it. Semaglutide copies parts of that message. When it reaches the receptor, the cell can pass the signal inward.",
  "Scientists also study how the molecule breaks down. Parts of its design help it attach to albumin, a carrier protein. That is a feature of the studied molecule. It does not prove what is in a purchased vial.",
  "The design study compared changed versions of the peptide and their receptor activity, breakdown and binding to a carrier protein.","Molecule, cell and animal experiments","26308095","A study of semaglutide does not test this supplier’s vial or show that it is suitable for personal use."),
 "glp-2":guide(
  "How one molecule can send messages through two different cell receptors.",
  "Tirzepatide can switch on two cell receiving points, called GIP and GLP-1 receptors. Each passes on its own signal. Two targets do not mean two equal effects. GLP-2 (TR) is a product name, not the natural GLP-2 hormone.",
  "Think of two doorbells wired to different rooms. One molecule can reach both, but the responses can differ. Scientists test the two receptors on their own to see which signals each one starts.",
  "The balance changes with the test setup. A stronger response at one target does not tell us the response at the other. The product name should not be used to guess the molecule’s targets.",
  "The discovery work tested activity at both GIP and GLP-1 receptors. It included cell and animal work as well as early human research on a study drug.","Receptor, animal and early human research","30473097","A study drug and a supplier’s research product are not the same tested item."),
 "glp-3":guide(
  "How one molecule interacts with three kinds of cell receiving points.",
  "Retatrutide can switch on three receptors: GIP, GLP-1 and glucagon. A receptor is a receiving point on a cell. Each starts a different message. Counting the targets does not tell us the final response.",
  "Think of three switches wired to different parts of a system. The GIP and GLP-1 routes help cells respond to food-related signals. The glucagon route has a different role, including signals to release stored sugar.",
  "Scientists test each route and then the whole system. The three messages do not all do the same job. A result from one route cannot simply be multiplied by three to predict what happens next.",
  "The discovery study found activity at all three receptors and examined their combined effects in experimental systems.","Receptor, animal and early human research","35985340","These are findings about the studied molecule, not three proven benefits of the product."),
 "bpc-157":guide(
  "How cells grip a surface, move and respond to stress in lab tests.",
  "A moving cell must grip, pull forward and let go. Rat-cell studies linked BPC-157 to changes in proteins that help with those steps. Scientists still do not know its full chain of actions.",
  "A cell’s grip points work a little like small anchors. In the cited test, scientists grew rat tendon cells in the lab. They watched how the cells moved and measured proteins at those grip points.",
  "The cells moved more in that test. That gives researchers a clue to study. It does not show that BPC-157 rebuilds tissue, or explain the first place the molecule attaches to start the response.",
  "Cultured rat tendon cells showed more movement and changes in grip-related proteins called FAK and paxillin. Those names refer to proteins inside cells.","Rat tendon cells grown in a lab","21030672","Cell movement is not proof of injury repair. The experiment did not test this supplier’s vial."),
 "ghk-cu":guide(
  "How a copper-binding peptide affects the support material around cells.",
  "GHK is a short chain that holds copper. Scientists study how cells respond to it, including changes in the support material around them. The peptide is not a piece of replacement tissue.",
  "The letters Cu mean copper. GHK holds a charged copper atom, called an ion. Holding and releasing copper can affect chemical reactions. The cell and its surroundings shape what happens next.",
  "Cells build a support network around themselves. Collagen, a strong fiber-like protein, is part of that network. Scientists measure changes in this material to learn about the cells doing the building.",
  "An experimental rat study measured more collagen and other support material after GHK-Cu exposure in the tested tissue model.","Experimental tissue model in rats","8227353","A tissue experiment does not establish a skin or hair benefit from this product."),
 "tb-500":guide(
  "How a related peptide affects the inner frame that helps cells move.",
  "A related molecule, full thymosin beta-4, binds a protein called actin. Actin helps cells hold their shape and move. TB-500 can name different peptide forms, so the exact chain must be checked.",
  "Imagine a cell with a frame that can be taken apart and rebuilt. Actin forms parts of that frame. Full thymosin beta-4 holds loose actin pieces and helps control which pieces are free.",
  "A shorter piece of a peptide may not do the same job as the whole chain. That is why research on full thymosin beta-4 cannot prove how every product called TB-500 works.",
  "The cited work tested full thymosin beta-4 in cell-movement and animal tissue experiments. It did not test every peptide form sold as TB-500.","Cell and animal research on a related molecule","10469335","Confirm the exact peptide chain. A related molecule is not automatically the same product."),
 "tesamorlin":guide(
  "How a message reaches the gland that controls growth-hormone release.",
  "Tesamorelin copies a signal sent to the pituitary, a small gland. The signal can prompt cells to release growth hormone they already hold. It is a message to the gland, not growth hormone itself.",
  "The natural message is called GHRH. It reaches a receptor, or receiving point, on the gland’s cells. Tesamorelin is a changed version of that message, designed to resist some normal breakdown.",
  "Scientists measure the timing and size of the gland’s response. The response depends on other signals too. The partner spells this product Tesamorlin; that spelling does not change which molecule the papers studied.",
  "The cited study measured patterns of growth-hormone release after tesamorelin exposure. It did not test the partner’s product.","Human hormone-signal research","21531600","A measured hormone response does not establish a benefit or safe use for this vial."),
 "mots-c":guide(
  "How cells sense their fuel supply and adjust the way they use it.",
  "MOTS-C is studied in a cell’s fuel-control system. Tests linked it to changes in a fuel-sensing protein. Think of adjusting a fuel budget, not adding fuel to a tank.",
  "Mitochondria are small parts of cells that help process fuel. MOTS-C is a peptide linked to them. In the original tests, it changed a chemical pathway and a signal called AICAR built up.",
  "AICAR can activate AMPK, a protein that helps cells respond to their fuel needs. Researchers measure that response. The peptide is not fuel itself, and a changed cell signal is not proof of more personal energy.",
  "Cell experiments linked MOTS-c to changes in AICAR and AMPK, parts of the fuel-sensing system. The paper also examined animal responses.","Cell and animal experiments","25738459","Changes in a cell’s fuel signals do not prove energy or fitness benefits from the product."),
 "nad-plus":guide(
  "How a small molecule helps cells pass materials between chemical reactions.",
  "NAD+ acts like a reusable carrier inside cells. It picks up tiny charged particles called electrons, then passes them on. Some cell reactions also use it up. NAD+ is not a peptide.",
  "When NAD+ picks up electrons, its form changes to NADH. After it passes them on, it can become NAD+ again. This cycle helps connect steps in the cell’s fuel-processing work.",
  "Other reactions use NAD+ as a starting material. Scientists study both jobs. But NAD+ in a bottle is outside a cell. Its presence there does not prove it can get inside and take part in those reactions.",
  "The cited enzyme study linked NAD to the removal of small chemical tags from proteins. An enzyme is a protein that helps a reaction happen.","Enzyme experiments","10693811","The molecule’s known jobs inside cells do not prove that this product reaches those cells."),
 "cjc-ipa-no-dac":guide(
  "How two separate signals reach the gland involved in hormone release.",
  "The two peptides are linked to two different receiving points on pituitary cells. That gland releases hormone signals. The blend is not growth hormone, and two routes do not prove a stronger combined result.",
  "The CJC part copies a message called GHRH. Ipamorelin reaches a different receptor, the ghrelin receptor. Each route can be studied on its own before anyone tests how they interact.",
  "No DAC means the CJC part lacks a group that helps another form bind to a carrier protein. Research on the DAC form cannot tell us how long this No DAC blend acts.",
  "Ipamorelin research measured responses in pituitary-cell experiments. The linked CJC design paper studied an albumin-binding form, not proof of this No DAC blend.","Separate-ingredient research","9849822","No study linked here establishes the finished blend’s combined action or duration."),
 "kpv":guide(
  "How a tiny peptide gets into cells and changes their alarm messages.",
  "KPV has three small building blocks. Some cells have a carrier that can bring it inside. In tests, cells then sent fewer of certain alarm messages. This does not prove a treatment effect.",
  "The carrier is called PepT1. Think of it as a small gate that moves short peptides into some cells. Not all cell types have the same gates or respond in the same way.",
  "Inside the tested cells, researchers measured less activity in parts of the alarm system. They also measured fewer released signal proteins. These are clues about a cell pathway, not a claim that the product treats disease.",
  "The cited work linked KPV entry to PepT1 and measured lower inflammatory signals in cell tests. It also included mouse experiments.","Cell and mouse experiments","18061177","The cell type and test setup matter. These results do not validate the supplier’s product."),
 "klow":guide(
  "How four ingredients relate to cell movement, cell support and cell signals.",
  "KLOW puts BPC-157, TB-500, GHK-Cu and KPV in one blend. Their studies look at different cell tasks. Adding the ingredients together does not prove that the blend does all those tasks or works better.",
  "BPC-157 research looks at cell grip and movement. Research on full thymosin beta-4 looks at a cell’s inner frame. GHK-Cu work looks at copper and the support material around cells. KPV work follows cell alarm messages.",
  "Think of four separate test results, not four steps in one proven process. The mixture needs its own tests. Its label must also identify each ingredient and its amount; we do not guess the proportions.",
  "The linked papers report separate ingredient findings, including cell-movement changes, support-material changes and KPV entry into cells. None tests this finished four-part blend.","Separate-ingredient research","18061177","Ingredient studies cannot prove a combined KLOW result. The exact TB-500 form also matters."),
 "semax":guide(
  "How a peptide may change the messages passed between nerve cells.",
  "Nerve cells use proteins to send messages. In rat studies, Semax changed one such message and its receiving point. Scientists have not mapped all the steps between Semax and that response.",
  "The message is called BDNF. It helps nerve cells manage their growth and connections. Its receiving point is called TrkB. Scientists can measure both to see how a signaling system changes.",
  "A change in BDNF does not prove that Semax attaches straight to TrkB. Think of a message changing somewhere in a chain of events. Finding the change does not tell us where the chain began.",
  "The rat-brain study measured changes in BDNF and TrkB activity after Semax exposure.","Rat nerve-tissue research","16996037","Changes in rat-cell signals do not prove better memory or focus from this product."),
 "glutathione":guide(
  "How cells handle certain reactive chemicals and recycle the helpers they use.",
  "Glutathione helps with some of a cell’s chemical cleanup. In one reaction, an enzyme uses it to turn peroxide into water. The glutathione changes form and needs another reaction to recycle it.",
  "Peroxide is a reactive chemical. Too much can damage parts of a cell. An enzyme, a protein that helps a reaction happen, uses glutathione to change peroxide into other substances.",
  "The used glutathione must be recycled before it can repeat that job. This takes other molecules and enzymes. It is a specific chemical cycle, not a promise that a product removes every kind of toxin.",
  "The original enzyme study described the glutathione-dependent reaction involving peroxide. Later work examined how cells recycle the changed glutathione.","Enzyme chemistry research","13491573","A known cell reaction is not proof of a detox effect or that this product enters cells."),
 "melanotan-ii":guide(
  "How a ring-shaped peptide interacts with several cell receiving points.",
  "Melanotan II copies part of a natural peptide message. It can reach several receptors in the melanocortin family. Each can start a different cell signal. It is not the same molecule as Melanotan I.",
  "A receptor is a receiving point for a chemical message. The MC1 receptor is linked to pigment-cell signals. The MC4 receptor has different roles in nerve signals. Sharing a family name does not make them interchangeable.",
  "Scientists compare which receptors respond and how long the signals last. Those tests depend on the cells and the exact molecule used. A result at one receptor cannot describe every action of the peptide.",
  "The cited cell study examined the timing of signals at the MC4 receptor after exposure to Melanotan II.","Receptor experiments in cells","26418335","Receptor findings do not establish tanning or other personal-use benefits from this product."),
 "glow":guide(
  "How three ingredients relate to cell movement and the support around cells.",
  "GLOW blends BPC-157, TB-500 and GHK-Cu. Each has a different research background. Tests of one ingredient do not prove how all three act together. GLOW does not include the KPV found in KLOW.",
  "BPC-157 studies follow how cells grip and move. Full thymosin beta-4 research follows the frame inside cells. GHK-Cu studies look at copper and the material that cells build around themselves.",
  "A blend brings ingredients together in one container. It does not join their separate findings into one proven result. The exact mixture, each amount and the TB-500 form need to be checked on their own.",
  "The linked papers tested individual compounds in cells and animal models. They did not test the finished GLOW blend.","Separate-ingredient research","21030672","The sources do not prove the blend has a stronger or combined effect."),
 "selank":guide(
  "Whether a peptide changes how cells respond to a nerve-signaling message.",
  "GABA is a signal that often acts like a brake in nerve cells. Selank research asks whether it changes the response to that signal. It has not been shown to be a simple brake switch itself.",
  "Scientists can measure which genes a cell is reading. Genes are instructions for making proteins. In one test, Selank alone did not change the activity of the genes being measured.",
  "The response was different when GABA and Selank were present together. That gives scientists a question to explore. It does not prove that Selank directly switches on a GABA receptor, the cell’s receiving point for that message.",
  "In cultured IMR-32 cells, Selank alone did not change the measured gene activity. The response to GABA changed when Selank was also present.","Human-derived cells grown in a lab","28293190","A cell response does not prove a calming effect or validate this product."),
 "melanotan-i":guide(
  "How a peptide message activates a receptor involved in pigment-cell signals.",
  "Melanotan I copies a natural signal that can reach the MC1 receptor. A receptor is a cell’s receiving point. Researchers measure the message passed inside the cell. Melanotan I and II are different molecules.",
  "MC1 can start a chain of signals inside pigment cells. One small messenger in that chain is called cAMP. It carries the signal onward to other parts of the cell.",
  "Different versions of a receptor may not respond the same way. Scientists compare them to separate the receptor’s role from the molecule’s role. A lab response is not proof of a result from a supplier’s vial.",
  "The cited work compared responses involving forms of the MC1 receptor. It helps explain why the exact receptor matters.","Cell-receptor research","16293341","These findings do not establish tanning or other cosmetic benefits from this product."),
 "igf-1-lr3":guide(
  "How a changed cell signal stays available to reach its receptor.",
  "IGF-1 is a cell message. Other proteins can catch it before it reaches a cell. The LR3 version attaches less to those binding proteins. That can change how much is free during a lab test.",
  "Think of a message being held before it reaches its reader. Binding proteins can hold IGF-1 outside a cell. Scientists changed part of the chain to study what happens when less of it is held.",
  "More free molecule does not always mean a stronger receptor. The original comparison depended on whether the cells made binding proteins. Researchers separate the amount available from the response once it reaches the receptor.",
  "Cell comparisons found that the activity difference depended on the presence of IGF-binding proteins.","Binding and cell-growth experiments","1378742","The findings do not establish muscle growth or a benefit from the merchant’s vial."),
 "5-amino-1mq":guide(
  "What happens when a compound slows one enzyme’s chemical job.",
  "5-Amino-1MQ is studied as a blocker of NNMT, an enzyme. Enzymes are proteins that help chemical jobs happen. NNMT adds a small tag to another molecule. Blocking that job can change the cell’s chemistry.",
  "The molecule that gets tagged is called nicotinamide. It can also be used to make NAD+, a helper in many cell reactions. Researchers ask what changes when less nicotinamide goes through the NNMT route.",
  "They measure the tagged product and other cell chemicals. A change in one route does not show that the whole cell works better. 5-Amino-1MQ is not a peptide or a supply of hormones.",
  "The cited work tested NNMT blocking and measured changes in cell chemistry, with further experiments in animals.","Enzyme, cell and animal experiments","29155147","These experiments do not prove weight-related or other personal-use benefits from the product."),
 "wolverine-stack":guide(
  "How two ingredients relate to cell movement and the frame inside cells.",
  "This blend contains BPC-157 and TB-500. BPC-157 research follows cell grip and movement. Research on full thymosin beta-4 follows the frame inside cells. Those separate findings do not prove that the blend works as a team.",
  "A cell needs grip points and a flexible inner frame to move. These are linked tasks, but testing two separate molecules is not the same as testing a mixture of them.",
  "The exact TB-500 form matters. A short piece may differ from full thymosin beta-4. The blend needs its own research, and its label must state the ingredient amounts rather than leaving the ratio to guesswork.",
  "The sources cover BPC-157 cell movement and full thymosin beta-4 tissue experiments. Neither establishes the finished blend’s combined action.","Separate-ingredient research","21030672","A shared research topic does not prove a better result from combining the ingredients."),
 "pt-141":guide(
  "How a peptide reaches receptors involved in nerve-cell messages.",
  "PT-141 can activate melanocortin receptors, including MC3 and MC4. These are receiving points that pass messages inside cells. Researchers study the nerve circuits involved, not just a local change in blood flow.",
  "Nerve cells pass messages through connected circuits. A receptor starts one part of that chain. PT-141 research examines how activating certain receptors changes activity farther along the circuit.",
  "Early animal work looked at a brain area called the hypothalamus. It helps control many automatic functions. A change there does not explain every effect or establish what a purchased research product will do.",
  "The cited work examined melanocortin-receptor activity and nerve-circuit responses in experimental models, including rats.","Receptor and rat nerve-circuit research","12851303","This research does not establish a personal-use benefit or the quality of this product."),
 "cagrilintide":guide(
  "How a peptide fits receiving points made from a receptor and helper proteins.",
  "Cagrilintide copies parts of a natural message called amylin. Its receiving system includes a receptor and helper proteins. The helpers can change how the message is read. It uses a different route from GLP-1 compounds.",
  "Think of a receiving point with an added helper part. The main part is called a calcitonin receptor. Certain helper proteins join it to form amylin receptors. These combinations are not all the same.",
  "Scientists study the shapes of the joined parts and the signals they pass on. This helps explain how the molecule fits. It does not turn a shape study into proof of a product’s effect.",
  "The cited structure study examined cagrilintide bound to calcitonin and amylin receptors, including how helper proteins affect the interaction.","Molecular-structure and receptor research","40204768","Receptor findings do not establish weight or medical benefits from the supplier’s vial."),
 "aod-9604":guide(
  "Whether a small piece based on a hormone changes fat-cell signals in experiments.",
  "AOD-9604 is based on a small part of growth hormone. It is not the whole hormone. Some animal tests examined fat-cell signals, but its full chain of actions is still not clear.",
  "Taking one piece from a large message does not keep every part of that message. Researchers test which actions, if any, remain after changing the peptide chain.",
  "Early work looked at pathways linked to fat-cell chemistry, including beta-3 receptors. A receptor is a receiving point. These tests do not settle the first target or every step that follows.",
  "Early animal experiments examined fat metabolism and beta-3-receptor-related pathways. They did not establish a complete mechanism.","Animal experiments","11713213","A change in fat-cell chemistry is not proof of weight loss from this product."),
 "dsip":guide(
  "How a small peptide may affect the release of nerve-cell messages.",
  "Scientists do not yet have one clear explanation for DSIP. A rat-tissue test found more release of another small messenger. That is a clue, not proof that DSIP acts as a sleep switch.",
  "Cells store some messages in tiny packets. Calcium can help trigger their release. In the cited test, DSIP was linked to the release of a messenger called Met-enkephalin from rat brain tissue.",
  "DSIP did not directly bind opioid receptors in that test. The effect may have been indirect. Its historical name refers to sleep, but a name does not prove a function or explain the whole pathway.",
  "Rat-brainstem slices released more Met-enkephalin in a calcium-dependent experiment. The study did not find direct opioid-receptor binding by DSIP.","Rat brain-tissue experiment","2706459","The target is still uncertain. This finding does not establish better sleep from the product."),
 "epithalon":guide(
  "How a short peptide relates to the end sections of DNA in lab-grown cells.",
  "Chromosomes are packages of DNA. Their ends have sections called telomeres. Small cell studies measured changes in an enzyme that adds to those ends after Epithalon exposure. The first step behind that change is not clear.",
  "Telomeres are a little like end caps, but they are made of repeated DNA. They can shorten as cells divide. An enzyme called telomerase can add more of that repeated DNA.",
  "Researchers measured this enzyme and the end sections in cultured cells. Longer end sections do not automatically mean healthier cells or longer life. The control of the process matters too.",
  "A small cell-culture study reported more telomerase activity and longer telomeres after exposure to the peptide.","Cells grown in a lab","12937682","Cell markers do not prove age reversal or longer life. More telomerase activity is not always helpful."),
 "ipamorelin":guide(
  "How a peptide message reaches cells involved in hormone release.",
  "Ipamorelin reaches the ghrelin receptor, a cell’s receiving point. In pituitary-cell tests, this signal could trigger the release of stored growth hormone. It is a message to the gland, not the hormone itself.",
  "The pituitary is a small gland that releases hormone signals. Its cells respond to several different messages. Ipamorelin is studied through the ghrelin route, which differs from the route used by GHRH-like peptides.",
  "Scientists compare the responses to learn how specific the signal is. A result depends on the cells and the test conditions. Similar research topics do not make different peptides interchangeable.",
  "The original work measured hormone release in pituitary-cell experiments and compared the response with other signals.","Pituitary-cell and animal experiments","9849822","A gland-cell response is not proof of muscle, recovery or other personal-use benefits."),
 "snap-8":guide(
  "Whether a short copy of a protein part could affect how cells release messages.",
  "Cells use proteins like a zipper to open message packets. SNAP-8 copies a small part of one of those proteins. The idea is that it could get in the way. The sources here do not prove that SNAP-8 does this.",
  "Nerve cells hold messages in tiny packets. To release them, the packet’s surface joins the cell’s outer surface. A group of proteins pulls the surfaces close, rather like closing a zipper.",
  "SNAP-25 is one of those proteins. SNAP-8 was designed to resemble part of it. Knowing how the normal zipper works does not prove that a small copy stops it. That needs direct tests of SNAP-8.",
  "The linked papers explain the normal message-release machinery. They are background research, not direct evidence that SNAP-8 blocks it.","Background protein-structure research","9759724","The proposed action is not established by these papers and is not a cosmetic claim."),
 "thymosin-alpha-1":guide(
  "How certain immune cells detect a signal and pass messages to other cells.",
  "Some immune cells act like scouts. Thymosin Alpha-1 studies look at how these cells respond and send messages onward. The research does not describe one switch that simply makes the whole immune system stronger.",
  "Scouting cells detect clues, process them and share signals. One group is called dendritic cells. Researchers test which receiving points and messages are involved when these cells encounter the peptide.",
  "In the cited work, scientists measured responses linked to threat-sensing proteins and a message called IL-12. The response depends on the cell and the trigger. Different immune tasks need different kinds of control.",
  "The cited study examined dendritic-cell responses and signals linked to Toll-like receptors, proteins that help cells detect certain triggers.","Immune-cell and animal research","14982877","A measured immune-cell response does not prove an immune benefit from the product."),
 "ll-37":guide(
  "How a peptide interacts with the thin outer barriers of cells and microbes.",
  "LL-37 can gather at some cell surfaces and disturb their outer barrier. That can let material leak through. The response depends on the surface and the liquid around it. It does not only affect harmful microbes.",
  "A cell membrane is a thin barrier made mostly of fatty molecules. Parts of LL-37 carry a positive charge. This helps it interact with some surfaces under certain test conditions.",
  "Scientists study whether those interactions form openings or change the barrier in other ways. A model membrane is simpler than a living system. The peptide can also affect cells that are not microbes.",
  "Laboratory membrane experiments observed openings and changes in the barrier after LL-37 exposure.","Laboratory membrane models","21463582","A membrane experiment does not show that the product safely targets only harmful cells."),
 "cartalax":guide(
  "Whether a short peptide changes which instructions lab-grown cells read.",
  "Genes are instructions for making proteins. Cartalax research measures changes in how cells read some of those instructions. That shows a response, but does not reveal every step that caused it.",
  "Cartalax is associated with a three-part peptide called AED. In cell studies, researchers measured changes in genes such as IGF1, which carries instructions for a growth-related signal.",
  "One idea is that very short peptides interact with DNA or proteins around it. That is still a proposed explanation. Measuring a gene change does not prove a direct path from the peptide to DNA.",
  "The cited work measured gene-activity changes in cultured stem cells exposed to the AED peptide.","Stem cells grown in a lab","32399807","The first target remains uncertain. These findings do not prove cartilage repair."),
 "sermorelin":guide(
  "How a shortened hormone-release message reaches the gland that receives it.",
  "Sermorelin copies a working part of GHRH, a natural message. It reaches receiving points on pituitary cells and can prompt stored growth hormone to be released. It does not supply growth hormone itself.",
  "The pituitary is a small gland. Its GHRH receptor receives one of the messages that control hormone release. Sermorelin contains the first 29 building blocks of that natural message.",
  "Other signals can change or oppose the response. Researchers compare peptide shapes and how quickly they break down. Research on a different changed version cannot prove how this supplier’s Sermorelin behaves.",
  "The linked design research explains GHRH-derived peptides and carrier binding in another form. It supplies background, not a test of this product.","Related-peptide design research","15817669","Related designs are not interchangeable, and the source does not validate this vial."),
 "kisspeptin":guide(
  "How an early message starts a chain of signals between nerve cells and a gland.",
  "Kisspeptin reaches a receiving point on certain nerve cells. Those cells can then release another message called GnRH. That message reaches the pituitary gland. Scientists study the steps in this signal chain.",
  "The first receptor is called KISS1R. A receptor is a receiving point. When it responds, it changes how easily the nerve cell fires and releases its next message.",
  "GnRH then helps control two other signals called LH and FSH. This is a chain of messages, not a direct supply of the hormones at its end. The partner’s product is the 10-part form of kisspeptin.",
  "The cited experiments linked kisspeptin-receptor activity to GnRH release. Other work recorded changes in nerve-cell activity.","Nerve-cell and hormone-signal research","15665093","These findings do not establish reproductive or other personal-use benefits from this vial."),
 "dihexa":guide(
  "A proposed nerve-cell signaling route whose key supporting paper was withdrawn.",
  "An earlier idea linked Dihexa to a cell-growth message called HGF. But a key paper was retracted in 2025. Retracted means withdrawn from the research record. We cannot present that paper’s explanation as an established fact.",
  "The proposed route involved HGF and its receptor, called c-Met. A receptor receives a message and starts signals inside a cell. The paper linked this route to changes in connections between nerve cells.",
  "The retraction changes how that claim must be read. The old explanation is a hypothesis, or an idea to test. It is not reliable proof of how this product works. More sound evidence would be needed.",
  "The linked record is the 2025 retraction notice for the earlier HGF/c-Met paper. It is a warning about the evidence, not support for the claim.","Retraction notice","40312093","A retracted paper cannot support a confident mechanism or memory-benefit claim."),
 "vip":guide(
  "How one peptide message leads to different responses in different cell types.",
  "VIP attaches to cell receiving points called VPAC1 and VPAC2. They pass a message inside the cell. What happens next depends on the kind of cell, so one signal does not mean one result everywhere.",
  "One inside messenger is called cAMP. Think of it as a relay runner passing on a message. Other proteins receive it and change what the cell does next.",
  "In gut-cell research, scientists measure salt and fluid movement. Other studies measure muscle-cell responses. These are different tasks that can share part of the same signaling route.",
  "Receptor experiments measured VIP-related signaling and cAMP responses. Other work examined where receptors occur in intestinal cells.","Cell-receptor research","10933794","A receptor response does not establish a useful result in every tissue or from this product."),
 "ara-290":guide(
  "How a small peptide may affect signals in cells under stress.",
  "ARA-290 was designed from a small part of EPO, a larger signal protein. Researchers study a proposed receiving system involved in cell stress. It is not the same as supplying full EPO.",
  "Full EPO is known for signals involved in making red blood cells. ARA-290 was designed to study a different route. The proposed receptor joins an EPO-receiving part with another part called CD131.",
  "Scientists measure stress messages and changes in cell death. These are specific test results. They do not make the proposed receptor route a general repair command or prove an effect from a supplier’s product.",
  "The cited experimental work measured stress-response and cell-death pathways after ARA290 exposure.","Experimental stress-response research","36085231","The proposed route must be kept separate from claims of tissue protection or repair."),
 "pinealon":guide(
  "How cells respond when reactive chemicals build up during stress.",
  "Cells make reactive chemicals during normal work. Too many can damage cell parts. Pinealon tests measured changes in those chemicals and in cell signals. Scientists have not established the whole chain of actions.",
  "One signal system in the studies is called ERK. It helps control cell responses and growth. Researchers measure when that signal turns on, along with markers of cell stress.",
  "A lower level of reactive chemicals does not prove that the peptide directly removes each one. It could affect other steps. The study gives clues about cell behavior, not a complete explanation.",
  "Cell experiments reported lower free-radical levels and changes in growth-related signals, including the timing of ERK activity.","Cell experiments","21978084","These findings do not establish a brain or personal-use benefit from the product."),
 "ahk-cu":guide(
  "How a copper-binding peptide affects cells taken from hair follicles.",
  "AHK-Cu is a short chain that holds copper. In lab tests, scientists studied cells from the base of hair follicles. They measured growth and survival signals. That does not prove a hair-growth result from the product.",
  "A follicle is the small structure a hair grows from. Support cells at its base help control its activity. Researchers tested isolated follicles and those support cells outside the body.",
  "Some measurements changed, while not all cell-death results were clear. The first steps behind the response are still being studied. AHK-Cu is also different from GHK-Cu; one building block in the chain changes.",
  "The study reported changes in isolated follicles and support-cell growth. Some cell-death measurements did not reach statistical significance, meaning the difference was not clear enough by the study’s test.","Isolated human follicles and cultured cells","17703734","A lab-grown follicle is not a trial showing a cosmetic benefit from this product."),
};

/** Preserve the finished-liquid evidence boundary while explaining the ingredient. */
const sprays:Record<string,string>={"ghkcu-spray":"ghk-cu","nad-plus-spray":"nad-plus","semax-spray":"semax","selank-spray":"selank","pt-141-spray":"pt-141","melanotan-ii-spray":"melanotan-ii","dsip-spray":"dsip","bpc-tb-spray":"wolverine-stack","bpc-spray":"bpc-157"};
for(const [id,parent] of Object.entries(sprays)){
 const source=base[parent];
 base[id]={...source,
  study:`${source.study} The prepared liquid is a separate research question.`,
  how:`${source.how} These findings do not test this spray.`,
  steps:[source.steps[0],`This product puts the compound${id==="bpc-tb-spray"?"s":""} in a prepared liquid. Other ingredients and the amount in each mL can change a test. Research on the ingredient does not prove that this liquid stays intact or reaches the same cells.`],
  finding:`${source.finding} This was not a test of ${PRODUCT_RESEARCH[id].name}.`,
  caution:"The papers do not establish how this finished liquid behaves. A spray name is a product format, not a direction for personal use."
 };
}
base["adalank-spray"]=guide(
 "How changes to a Selank-like peptide might change the molecule’s behavior.",
 "Adalank is a changed form of Selank with small chemical caps on its ends. Caps can affect a molecule, but they do not prove that it lasts longer or works better. Direct evidence for this form is limited.",
 "The supplier calls the molecule N-acetyl Selank amidate. In plain terms, it is a Selank-like chain with changed ends. Changing the ends can change how a peptide breaks down or interacts with other molecules.",
 "Selank studies provide a starting question about nerve-cell messages. They do not answer that question for Adalank. We did not identify a study in the reviewed sources that maps this changed molecule’s own actions.",
 "The linked paper concerns Selank and GABA-related signals. It does not test Adalank or this prepared spray.","Parent-peptide background only","28293190","A changed peptide needs its own evidence. Selank findings cannot be treated as Adalank results.");
base["adamax-spray"]=guide(
 "How changing a Semax-like peptide could affect its shape and behavior.",
 "Adamax is described as a Semax-like chain with extra building blocks and a chemical cap. Those changes may alter the molecule. They do not prove the same effect, a stronger effect or a longer-lasting one.",
 "The supplier describes nine amino-acid building blocks, compared with seven in Semax. Amino acids are the small parts that make a peptide chain. Changing those parts can also change what the molecule attaches to.",
 "Semax studies look at nerve-cell messages, but do not map Adamax’s actions. Direct evidence for this changed form was not identified in the reviewed sources. Its name and design cannot fill that gap.",
 "The linked study measured Semax-related nerve signals in rats. It did not test Adamax or this spray.","Parent-peptide background only","16996037","The actual mechanism remains unknown in the sources reviewed here.");

export const PRODUCT_GUIDES:Readonly<Record<string,ProductGuide>>=base;
export const SCIENCE_WORDS:readonly [string,string][]=[
 ["Peptide","A short chain of building blocks called amino acids."],
 ["Receptor","A receiving point on a cell that responds to certain messages."],
 ["Enzyme","A protein that helps a chemical reaction happen."],
 ["Cell study","A test on cells grown outside the body. It is not a trial in people."],
 ["Animal study","A test in an animal model. Its results may not carry over to people."],
 ["Hypothesis","An idea that still needs testing."],
 ["Batch report / COA","A report about a sample from one batch. It does not prove a health benefit."],
];
export function productGuideDetails(product:SupplierProduct):readonly [string,string][] {
 const d=PRODUCT_RESEARCH[product.id];
 return [
  ["Product name",product.name],
  ...(d.aliases.length?[["Also found in research as",d.aliases.join(", ")] as [string,string]]:[]),
  ["What is in it",d.what],
  ["Product form",product.kind==="blend"?"Several named compounds in one blend":product.kind==="spray"?"A ready-made liquid":product.kind==="water"?"Water with a preservative":"One named compound"],
  ["Amount and concentration","Check the chosen size and current label on the partner’s page. We do not assume one amount for every size."],
  ["Batch testing","Match the lot number on the container to its certificate of analysis (COA), the batch test report."],
  ["Storage","Follow the current label and the lab’s approved procedure. Dry powder and prepared liquids may need different conditions."],
 ];
}
export function productGuideFaq(product:SupplierProduct):readonly [string,string][] {
 const g=PRODUCT_GUIDES[product.id];
 return [
  [`What do the studies tell us about ${product.name}?`,g.caution],
  [product.kind==="blend"||product.id==="bpc-tb-spray"?"Do ingredient studies prove how the blend works?":product.kind==="spray"?"Does a paper about the ingredient test this spray?":"Does the product name prove what is in the container?",
   product.kind==="blend"||product.id==="bpc-tb-spray"?"No. A mixture needs its own tests. Each ingredient’s identity and amount matter. Separate studies do not prove a stronger combined effect.":product.kind==="spray"?"No. The liquid has its own ingredients and concentration. The finished product must be checked separately from the molecule studied in a paper.":"No. Match the exact name, form and amount on the label. Then check the report for that batch. Similar names can refer to different molecules."],
  ["What does a purity number mean?","It describes a result from a particular test on a sample. It does not mean the product is safe, suitable for personal use or proven to have a health effect."],
  ["Why do some sources use harder words?","Research papers describe exact methods and results. We explain the main ideas here. Open the linked paper for the full details, including what was tested and the study’s limits."],
  ["Can the calculator tell me how to use this product?","No. It checks math from numbers you enter. It does not choose a dose, a mixing method or a way to use a product."],
 ];
}
