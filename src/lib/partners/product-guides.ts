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
  "Whether a lab sample dissolves in this water and stays unchanged.",
  "Water can spread some dry materials through a liquid, like sugar in a glass of water. Benzyl alcohol is an added chemical that slows the growth of bacteria. It does not remove all germs. A lab must check whether the water and the sample work together.",
  "When sugar dissolves, its tiny parts spread through the water. Some lab samples do this too. Others stay in clumps or change into other chemicals. Clear liquid alone does not prove that a sample is unchanged.",
  "The water holds the sample. The added benzyl alcohol slows bacterial growth. These are different jobs. Neither job proves that the liquid is free of all germs or works with every peptide.",
  "The partner lists water with 0.9% benzyl alcohol. That is about nine parts benzyl alcohol in every thousand parts of liquid. It is a label description, not a test with every sample.","Partner product information","","A preservative does not remove all germs or make every sample suitable for research."),
 "glp-1":guide(
  "How a lab-made message changes what a cell does when sugar is present.",
  "Cells are tiny living parts of tissue. Some make insulin, a message that helps other cells take in sugar. Semaglutide attaches to a protein on these cells and starts steps that can release insulin when sugar is present. This protein is called the GLP-1 receptor. Lab tests measure those steps.",
  "A protein is a tiny chain folded into a shape that does a job. Here, one sits on the outside of a cell. When a matching chemical attaches, the protein changes shape and starts a message inside.",
  "The message can help an insulin-making cell release what it has stored. Researchers also test how the studied molecule breaks down and attaches to albumin, a protein that carries other chemicals. These tests do not check a supplier’s vial.",
  "Scientists compared versions of the molecule. They measured cell messages, how fast each version broke down and how well it attached to a protein that carries chemicals.","Molecule, cell and animal experiments","26308095","A study of semaglutide does not test this supplier’s vial or show that it is suitable for personal use."),
 "glp-2":guide(
  "How one lab-made message acts through two different proteins on cells.",
  "Tirzepatide can attach to two kinds of proteins on cells, called GIP and GLP-1 receptors. Both can start steps that release insulin, a message that helps cells take in sugar. Scientists test each route because the responses can differ. GLP-2 (TR) is a product name, not the natural GLP-2 hormone.",
  "A cell is a tiny living part of tissue. Its outer surface has proteins that respond to matching chemicals. The proteins called GIP and GLP-1 receptors can each start a message inside an insulin-making cell.",
  "Scientists test one route at a time, then compare them. Reaching two targets does not mean the two responses are equal or can simply be added. A study drug is also a different tested item from a supplier’s vial.",
  "The study measured responses at both GIP and GLP-1 receptors, the proteins that start these cell messages. It included cells, animals and an early human study of a study drug.","Receptor, animal and early human research","30473097","A study drug and a supplier’s research product are not the same tested item."),
 "glp-3":guide(
  "How one molecule starts three different kinds of messages in cells.",
  "Retatrutide can start messages through three proteins on cells. Two, GIP and GLP-1 receptors, help link sugar to the release of insulin. Insulin tells other cells to take in sugar. The third, the glucagon receptor, can send a liver cell a message to release stored sugar. The three jobs are different.",
  "Cells are tiny living parts of tissue. A receptor is a protein that responds when a matching chemical attaches. It then starts steps inside the cell. Which steps follow depends on both the protein and the kind of cell.",
  "Scientists test each of the three routes before looking at how they work together. One route can send a different message from another. Counting three targets cannot predict a result for the whole system.",
  "Scientists found that the molecule started messages at all three targets. They then studied how those messages acted together in cells, animals and early human research.","Receptor, animal and early human research","35985340","These are findings about the studied molecule, not three proven benefits of the product."),
 "bpc-157":guide(
  "How cells grip a surface and move across it in a lab test.",
  "A cell is a tiny living part of tissue. To move, it grips the surface around it, pulls forward and lets go at the back. In rat-cell tests, BPC-157 changed proteins that help with this grip. The cells moved more. Scientists still do not know what starts the full response.",
  "The tested cells came from rat tendons, the bands that join muscle to bone. Scientists grew the cells in a lab dish. They watched movement and measured proteins at the places where cells grip a surface.",
  "A protein is a tiny folded chain that does a job in a cell. The proteins measured here help connect a cell to its surroundings. More movement in a dish does not show that tissue was repaired.",
  "Rat tendon cells grown in a lab moved more after exposure. Two proteins involved in cell grip, called FAK and paxillin, also changed. The test did not show injury repair in people.","Rat tendon cells grown in a lab","21030672","Cell movement is not proof of injury repair. The experiment did not test this supplier’s vial."),
 "ghk-cu":guide(
  "How a copper-holding chain affects the support that cells build around them.",
  "Cells are tiny living parts of tissue. They build a support network around themselves, like a net that holds things in place. GHK-Cu is a short chain that holds copper. Researchers test whether it changes how much of this support material cells make. It is not replacement tissue.",
  "Cu is the short chemical name for copper. GHK can hold a tiny bit of copper and release it during chemical reactions. The amount of copper and the surrounding liquid can change what happens.",
  "One part of the support network is collagen, a protein that forms strong fibers. Researchers measure how much is made. More collagen in one test does not by itself prove that tissue works better.",
  "In an experiment in rats, scientists measured more collagen and other material that supports cells. This was a tissue test, not a test of the partner’s product or a skin or hair benefit.","Experimental tissue model in rats","8227353","A tissue experiment does not establish a skin or hair benefit from this product."),
 "tb-500":guide(
  "How a related molecule changes the inner frame that helps a cell move.",
  "A cell is a tiny living part of tissue. Inside it, small pieces of a protein called actin join to make a frame. That frame changes as the cell moves. Full thymosin beta-4 holds some loose actin pieces. A shorter product called TB-500 may not act the same way.",
  "Think of a frame built from many small pieces. A cell takes apart and rebuilds parts of its actin frame as it moves. Holding some pieces aside can change which pieces are free to join it.",
  "The cited research tested full thymosin beta-4. TB-500 can refer to a shorter piece or a different listed form. Check the exact peptide chain, meaning the order of its small building blocks, before comparing research.",
  "The study tested full thymosin beta-4 in cell and animal experiments involving movement and tissue. It did not test every form sold under the TB-500 name.","Cell and animal research on a related molecule","10469335","Confirm the exact peptide chain. A related molecule is not automatically the same product."),
 "tesamorlin":guide(
  "How a copied message makes a small gland release a stored hormone.",
  "The pituitary is a small organ that releases chemical messages called hormones. Tesamorelin copies one message that tells its cells to release stored growth hormone. It starts this request by attaching to a protein on the cell. It does not supply growth hormone itself.",
  "Cells are tiny living parts of tissue. Pituitary cells can hold growth hormone until another message triggers release. The natural trigger is called GHRH. Tesamorelin copies part of it, with changes that affect how it breaks down.",
  "Scientists measure how much hormone is released and when. Other messages can change that response. The partner spells this product Tesamorlin. The spelling does not make the supplier’s vial the item tested in a paper.",
  "Researchers measured the timing and size of growth-hormone release after exposure to tesamorelin in a human study. They did not test this supplier’s product.","Human hormone-signal research","21531600","A measured hormone response does not establish a benefit or safe use for this vial."),
 "mots-c":guide(
  "How cells change their chemical work when their fuel supply changes.",
  "Cells are tiny living parts of tissue. They use fuel to do their work. MOTS-C changed a chemical step in cell tests. Another chemical then built up and helped turn on a protein that senses fuel needs. This is a change in how the cell manages fuel, not extra fuel.",
  "Mitochondria are small parts inside cells that help turn fuel into usable energy. MOTS-C is linked to them. In the cited tests, it slowed part of a chemical process and a substance called AICAR built up.",
  "AICAR can turn on AMPK, a protein that helps control how a cell uses and saves fuel. Researchers measure this change. It does not show that a product gives a person more energy.",
  "Cell tests found changes in AICAR and AMPK, two parts of the system that responds to a cell’s fuel supply. The paper also tested responses in animals.","Cell and animal experiments","25738459","Changes in a cell’s fuel signals do not prove energy or fitness benefits from the product."),
 "nad-plus":guide(
  "How cells reuse a small chemical helper while they process fuel.",
  "NAD+ is a small chemical found inside cells, the tiny living parts of tissue. During some reactions, it picks up tiny charged particles and passes them to another reaction. This helps cells process fuel. Other reactions use NAD+ up. NAD+ outside a cell does not automatically get inside.",
  "The particles are called electrons. Think of NAD+ as a small carrier making repeated trips. When it picks up electrons, it becomes NADH. After it gives them up, it can become NAD+ again.",
  "Cells also use up NAD+ in other jobs, including removing small chemical pieces from proteins. A protein is a folded chain that does a job. Knowing these jobs does not show that a purchased product reaches the inside of cells.",
  "The cited test showed that an enzyme, a protein that speeds up a reaction, needed NAD to remove small chemical pieces from other proteins.","Enzyme experiments","10693811","The molecule’s known jobs inside cells do not prove that this product reaches those cells."),
 "cjc-ipa-no-dac":guide(
  "How two ingredients start different messages in a hormone-releasing gland.",
  "This blend has two peptides, or short chemical chains. Each is linked to a different protein on cells of the pituitary, a small organ that releases hormones. Hormones are chemical messages. Studies ask how each ingredient starts a message to release stored growth hormone. They do not prove how this blend acts.",
  "The CJC part copies a natural message called GHRH. Ipamorelin attaches to a different protein, called the ghrelin receptor. Both routes can be studied in cells. They are not two proven steps of one combined process.",
  "No DAC means this CJC form lacks an added part used in another form to attach to a carrier protein. A study of that other form cannot tell us how long this blend lasts.",
  "The ipamorelin paper measured hormone release in cells from the pituitary gland. The linked CJC paper tested a different form with a carrier-binding part. Neither proves how this No DAC blend works.","Separate-ingredient research","9849822","No study linked here establishes the finished blend’s combined action or duration."),
 "kpv":guide(
  "How a tiny chain enters cells and changes some of their alarm messages.",
  "Cells are tiny living parts of tissue. Some have a protein that brings small chemical chains inside, a little like a gate. KPV can enter through this protein. In tests, the cells then sent fewer of some alarm messages. This is one measured response, not proof of disease treatment.",
  "The gate-like protein is called PepT1. It moves some short chains through the cell’s outer barrier. Different kinds of cells have different amounts of this protein, so they may not all take in KPV the same way.",
  "Researchers measured messages that cells send after a trigger, such as a chemical that starts an alarm response. They measured changes inside cells and in the messages released. This does not show that every alarm is stopped.",
  "Cell tests linked KPV entry to the PepT1 protein and found lower levels of some alarm messages. The paper also included experiments in mice.","Cell and mouse experiments","18061177","The cell type and test setup matter. These results do not validate the supplier’s product."),
 "klow":guide(
  "How four separate ingredients relate to cell movement, support and alarm messages.",
  "KLOW mixes BPC-157, TB-500, GHK-Cu and KPV. Cells are tiny living parts of tissue. Studies of these ingredients look at how cells move, build support around themselves or send alarm messages. Putting the ingredients in one vial does not prove they do these jobs together or work better.",
  "BPC-157 studies measure how cells grip a surface and move. Studies of full thymosin beta-4 look at the frame inside a cell. GHK-Cu studies measure support material around cells. KPV studies measure alarm messages.",
  "These are four separate research questions. To learn how the mixture acts, it needs its own tests. The label must also identify each ingredient and its amount. We do not guess how much of each is present.",
  "The papers report findings for separate ingredients, including changes in cell movement, support material and alarm messages. None tests this finished four-part blend.","Separate-ingredient research","18061177","Ingredient studies cannot prove a combined KLOW result. The exact TB-500 form also matters."),
 "semax":guide(
  "How a short chain changes messages that help nerve cells form connections.",
  "Nerve cells are tiny living parts that pass messages. One chemical message, called BDNF, helps them grow and form connections. Rat studies found that Semax changed this message and the protein that responds to it. Scientists have not worked out every step that caused the change.",
  "BDNF attaches to a protein on nerve cells called TrkB. That starts steps inside the cell. Scientists measured both BDNF and TrkB to see whether this part of the message system changed.",
  "Measuring a change does not reveal its first cause. For example, a message can change because a cell makes more of it, not because a peptide attaches to the same protein. The whole chain still needs testing.",
  "In rat nerve tissue, researchers measured changes in BDNF and TrkB, a message and the protein that responds to it. The study did not test memory or focus benefits from this supplier’s product.","Rat nerve-tissue research","16996037","Changes in rat-cell signals do not prove better memory or focus from this product."),
 "glutathione":guide(
  "How cells change certain harmful chemicals into less reactive ones.",
  "Cells are tiny living parts of tissue. Some of their chemical work makes peroxide, a substance that can damage cell parts if too much builds up. Glutathione helps a protein turn peroxide into water. It changes during that job and must be recycled before it can help again.",
  "The protein doing this work is an enzyme, which means it helps a chemical reaction happen faster. It uses glutathione during the reaction. This is a specific job involving peroxide, not removal of every harmful chemical.",
  "Another enzyme and other cell chemicals help change used glutathione back into a form that can work again. Researchers study both steps. A product outside a cell is not proof that this cycle will change inside it.",
  "The cited enzyme experiment described a reaction that used glutathione to change peroxide. Other research studied how cells turn the used glutathione back into a form they can reuse.","Enzyme chemistry research","13491573","A known cell reaction is not proof of a detox effect or that this product enters cells."),
 "melanotan-ii":guide(
  "How a ring-shaped chain starts different kinds of messages in cells.",
  "A cell is a tiny living part of tissue. Melanotan II can attach to several proteins on cells and start messages inside. One type is linked to pigment, the material that gives tissue color. Another is linked to nerve-cell messages. Scientists test these separately. Melanotan I is a different molecule.",
  "The proteins are called melanocortin receptors. Each responds to certain chemicals, then starts steps inside a cell. One is named MC1 and another MC4. Their shared family name does not mean they do the same job.",
  "The linked experiment followed MC4 messages over time. A result at MC4 cannot explain every other target. The exact molecule and the type of cell both affect what the test can tell us.",
  "Scientists measured how long messages continued at the MC4 protein in cell tests after Melanotan II exposure. The study did not test this supplier’s product.","Receptor experiments in cells","26418335","Receptor findings do not establish tanning or other personal-use benefits from this product."),
 "glow":guide(
  "How three separate ingredients relate to cell movement and cell support.",
  "GLOW mixes BPC-157, TB-500 and GHK-Cu. Cells are tiny living parts of tissue. Separate studies look at how they move and build support around themselves. The mixture needs its own tests to show how the ingredients act together. GLOW does not include the KPV found in KLOW.",
  "BPC-157 research measures how cells grip and move. Full thymosin beta-4 research looks at the frame inside cells. GHK-Cu research measures the support material that cells make around themselves. Each asks a different question.",
  "Putting compounds in one vial does not join their separate findings into one result. Researchers need to check the exact mixture and each ingredient amount. The exact form listed as TB-500 also needs to be known.",
  "The cited studies tested separate ingredients in cells and animals. They did not test the finished three-ingredient GLOW blend or show that its ingredients work better together.","Separate-ingredient research","21030672","The sources do not prove the blend has a stronger or combined effect."),
 "selank":guide(
  "Whether a short chain changes how nerve-like cells respond to a stop message.",
  "Nerve cells pass messages. GABA is one that often makes a nerve cell less likely to send its next message, like a brake. Selank research asks whether it changes the response to GABA. In one cell test, Selank alone did not change the measured activity. It is not a proven brake switch.",
  "Genes are a cell’s built-in instructions for making proteins, the small folded chains that do many jobs. Researchers measured which instructions the cells were reading. This can show a response even when its cause is not clear.",
  "The measured response to GABA changed when Selank was also present. That does not prove Selank attaches straight to the protein that responds to GABA. The steps between the peptide and the change still need study.",
  "In human-derived cells grown in a lab, Selank alone did not change the gene activity being measured. The response to GABA changed when Selank was present too.","Human-derived cells grown in a lab","28293190","A cell response does not prove a calming effect or validate this product."),
 "melanotan-i":guide(
  "How a copied message starts chemical steps in pigment cells.",
  "Pigment is the material that gives tissue color. Melanotan I copies a natural chemical message that can attach to a protein on pigment cells. The protein, called MC1, then starts more messages inside. Scientists measure those steps. The molecule is different from Melanotan II.",
  "Cells are tiny living parts of tissue. When the matching message attaches to MC1 on a cell, it can increase a chemical called cAMP inside. That chemical passes the message to other cell parts.",
  "Different versions of MC1 may respond differently to the same message. Scientists compare these versions to learn which part of the response comes from the protein. A cell message is not proof of a cosmetic result.",
  "Researchers compared cell messages at different versions of the MC1 protein. The experiments help explain how that protein responds, not how a supplier’s product performs.","Cell-receptor research","16293341","These findings do not establish tanning or other cosmetic benefits from this product."),
 "igf-1-lr3":guide(
  "How a changed growth message stays free to reach cells in a lab test.",
  "Cells are tiny living parts of tissue. IGF-1 is a chemical message that can tell some cells to grow or divide. Other proteins can hold that message and limit how much is free. IGF-1 LR3 is a changed version that binds less to some of these holding proteins. Researchers test what that changes.",
  "Think of some messages being held back before they reach a cell. The holding proteins are called IGF-binding proteins. Changing the message can change how much is held, without making the cell’s response system stronger.",
  "In the cited comparison, the result depended on whether cells made these holding proteins. Scientists must check both the free message and the cell’s response. One result cannot describe every type of cell or supplier product.",
  "The difference between the tested forms depended on whether the cells made IGF-binding proteins, which hold some of the message. The study did not test this supplier’s vial.","Binding and cell-growth experiments","1378742","The findings do not establish muscle growth or a benefit from the merchant’s vial."),
 "5-amino-1mq":guide(
  "What changes when a compound slows one chemical job inside cells.",
  "Cells are tiny living parts of tissue. A protein called NNMT adds a small chemical piece to another substance. 5-Amino-1MQ is studied for slowing that job. Scientists measure what builds up and what gets used less. Changing one chemical job does not mean the whole cell works better.",
  "NNMT is an enzyme, a protein that speeds up a chemical reaction. The substance it changes is called nicotinamide. Cells also use nicotinamide to make NAD+, a helper in their fuel-processing work.",
  "Researchers measure the substances before and after the NNMT step to see whether it slowed. They then check other cell chemicals. This asks what changed inside the test system, not whether a product creates a personal benefit.",
  "Scientists tested whether the compound slowed NNMT and measured changes in cell chemicals. Further experiments used animals. These findings do not establish a result for the partner’s product.","Enzyme, cell and animal experiments","29155147","These experiments do not prove weight-related or other personal-use benefits from the product."),
 "wolverine-stack":guide(
  "How two separate ingredients relate to the way cells move.",
  "This blend mixes BPC-157 and TB-500. Cells are tiny living parts of tissue. To move, they grip a surface and change their inner frame. Separate ingredient studies examine these jobs. They do not prove the blend works as a team. Research on full thymosin beta-4 may not match the TB-500 form.",
  "In BPC-157 tests, scientists measured proteins at the places where cells grip a surface. Full thymosin beta-4 work concerns actin, the protein pieces that help form the frame inside a cell.",
  "A shorter piece of a peptide can act differently from the full chain. The label must identify the TB-500 form and each ingredient amount. A shared research topic cannot replace tests of the finished mixture.",
  "The papers cover BPC-157 cell movement and experiments with full thymosin beta-4. They do not establish how the two ingredients act together in this blend.","Separate-ingredient research","21030672","A shared research topic does not prove a better result from combining the ingredients."),
 "pt-141":guide(
  "How a copied chemical message changes activity in linked nerve cells.",
  "Nerve cells pass messages to one another. PT-141 can attach to certain proteins on these cells, called melanocortin receptors, and start a message inside. Scientists study how that message changes the next cells in the chain. This research does not establish a personal-use benefit from the product.",
  "The proteins include types called MC3 and MC4. A protein is a small folded chain that does a job. These types respond to matching chemicals and start steps inside the cell, rather than carrying a message between cells themselves.",
  "Early animal work studied the hypothalamus, a small brain region involved in many automatic tasks. Researchers measured parts of that message chain. A change in one part cannot explain every response or test the supplier’s vial.",
  "The cited work tested responses at melanocortin proteins and in connected nerve cells, including experiments in rats. It did not test the partner’s research product.","Receptor and rat nerve-circuit research","12851303","This research does not establish a personal-use benefit or the quality of this product."),
 "cagrilintide":guide(
  "How a chemical message fits a cell protein with added helper parts.",
  "Cells are tiny living parts of tissue. Cagrilintide copies parts of a natural message called amylin. It attaches to a protein on a cell. Small helper proteins can join that protein and change how it responds. Researchers study the fit and the message it starts. This is a different route from GLP-1.",
  "The main protein is called a calcitonin receptor. When certain helper proteins join it, the group can respond to amylin. Think of changing one part of a tool so it fits a different shape.",
  "Scientists compare the shapes of these joined parts and measure the cell messages that follow. A shape that fits in a test does not show that a finished product has a useful effect.",
  "The study examined the shape of cagrilintide attached to these cell proteins. It showed how helper proteins affect the fit. It did not test this supplier’s vial.","Molecular-structure and receptor research","40204768","Receptor findings do not establish weight or medical benefits from the supplier’s vial."),
 "aod-9604":guide(
  "Whether a small copied part of a hormone changes fat-cell chemistry.",
  "A hormone is a chemical message. AOD-9604 copies a small part of growth hormone, not the whole message. Early animal tests looked at changes in how fat cells handle fat. Scientists have not settled all the steps involved. These tests do not prove weight loss from the product.",
  "Cells are tiny living parts of tissue. Fat cells store fat and can break it into smaller parts. Scientists measure these chemical changes to learn which jobs, if any, a short piece of a hormone can affect.",
  "The early work examined proteins called beta-3 receptors, which can start messages in fat cells. A change linked to these proteins does not prove that AOD-9604 attaches to them or explain every step.",
  "Animal experiments examined fat breakdown and messages linked to beta-3 proteins on cells. They did not establish a full explanation of how AOD-9604 acts.","Animal experiments","11713213","A change in fat-cell chemistry is not proof of weight loss from this product."),
 "dsip":guide(
  "Whether a short chemical chain changes the messages released by nerve tissue.",
  "Nerve cells hold some chemical messages in tiny packets. In a rat-tissue test, DSIP was linked to more release of one such message. Scientists do not yet have a full explanation for this change. Its name refers to sleep, but that does not make it a proven sleep switch.",
  "The released message was called Met-enkephalin. In the test, calcium was needed for the release response. Calcium can help cells open their message packets. This gives researchers one part of the process to examine.",
  "The experiment did not find that DSIP attached directly to opioid receptors, the proteins that respond to certain nerve messages. Its effect may have involved other steps. This test cannot explain every action of DSIP.",
  "Slices of rat brain tissue released more Met-enkephalin, a nerve message, in a test that depended on calcium. DSIP did not directly attach to the opioid proteins tested.","Rat brain-tissue experiment","2706459","The target is still uncertain. This finding does not establish better sleep from the product."),
 "epithalon":guide(
  "Whether a short chain changes the ends of a cell’s stored instructions.",
  "Cells are tiny living parts of tissue. Their instructions are stored in DNA. DNA is packed into bundles with repeated sections at their ends, called telomeres. One small cell study reported longer end sections after Epithalon exposure. The steps behind this are not clear. Longer ends do not prove longer life.",
  "Telomeres are a little like end caps on the DNA bundles. They can get shorter when cells divide. A protein called telomerase can add more repeated DNA to these end sections.",
  "Scientists measured this protein’s activity and the length of the end sections in lab-grown cells. A longer end section does not automatically mean a healthier cell. How the process is controlled matters too.",
  "A small study in lab-grown cells reported more activity by the protein that adds to DNA ends, called telomerase. It also reported longer end sections. It did not show age reversal.","Cells grown in a lab","12937682","Cell markers do not prove age reversal or longer life. More telomerase activity is not always helpful."),
 "ipamorelin":guide(
  "How a short chemical message makes gland cells release a stored hormone.",
  "The pituitary is a small organ that releases hormones, or chemical messages. Ipamorelin attaches to a protein on some of its cells. This can start steps that release stored growth hormone. Scientists measure that response. Ipamorelin sends a release message; it does not supply the hormone itself.",
  "The protein is called the ghrelin receptor. It responds when a matching chemical attaches and starts steps inside the cell. This route is different from the route used by peptides that copy the GHRH message.",
  "The gland responds to more than one message at a time. Researchers compare responses under set test conditions. Sharing a research topic does not make two peptides interchangeable or prove that a mixture works better.",
  "Scientists measured growth-hormone release in cells from the pituitary gland. They compared the response with other messages and also used animal experiments. This was not a test of the partner’s vial.","Pituitary-cell and animal experiments","9849822","A gland-cell response is not proof of muscle, recovery or other personal-use benefits."),
 "snap-8":guide(
  "Whether a small copy of a protein part could change how cells release messages.",
  "Nerve cells keep chemical messages in tiny packets. To release them, proteins pull a packet against the cell’s edge, like closing a zipper. SNAP-8 copies a small part of one protein. The idea is that it could get in the way. The linked papers do not prove that it does.",
  "The packet’s outer layer must join the cell’s outer layer before its message can leave. Several proteins pull them close. One of these proteins is called SNAP-25. Scientists have studied how these parts fit together.",
  "SNAP-8 copies a short piece of SNAP-25. A copy of a piece does not automatically block the whole process. The cited sources explain the normal proteins; direct tests of SNAP-8 would be needed to prove the proposed action.",
  "The cited papers describe the normal proteins that help cells release messages. They do not directly test whether SNAP-8 stops that process.","Background protein-structure research","9759724","The proposed action is not established by these papers and is not a cosmetic claim."),
 "thymosin-alpha-1":guide(
  "How some cells detect a trigger and tell other cells about it.",
  "Some immune cells act like scouts: they detect clues and send messages to other cells. Thymosin Alpha-1 studies ask how these cells respond to a trigger. Researchers measure the messages they send. This does not show that the peptide makes the whole immune system stronger.",
  "The tested scout cells are called dendritic cells. Like other cells, they are tiny living parts of tissue. They use proteins to detect some outside chemicals and start a response inside.",
  "Scientists measured responses linked to threat-detecting proteins and a released message called IL-12. The result depends on the cell and the trigger. A bigger response is not always better; different tasks need different control.",
  "The study tested how dendritic cells responded and sent messages. It examined proteins that detect some triggers, called Toll-like receptors, and included animal research.","Immune-cell and animal research","14982877","A measured immune-cell response does not prove an immune benefit from the product."),
 "ll-37":guide(
  "How a short chain can make openings in a cell’s outer barrier.",
  "A cell is a tiny living part of tissue. It has a thin outer layer that keeps its contents in. LL-37 can gather at some outer layers and make them leaky in tests. The result depends on the layer and the surrounding liquid. LL-37 does not affect only harmful microbes.",
  "The outer layer is called a membrane. It is made mostly of fat-like molecules, tiny groups of joined atoms. Parts of LL-37 have an electrical charge that helps them attach to some surfaces.",
  "Scientists can build simple model membranes to study openings and leaks. These models have fewer parts than living cells. A result in a model does not prove that the peptide picks only harmful cells in a living system.",
  "In lab-made models of cell barriers, scientists observed openings and changes after LL-37 exposure. These were simpler tests than a whole living system.","Laboratory membrane models","21463582","A membrane experiment does not show that the product safely targets only harmful cells."),
 "cartalax":guide(
  "Whether a short chain changes which built-in instructions a cell reads.",
  "Cells are tiny living parts of tissue. Genes are their instructions for making proteins, the small folded chains that do many jobs. Cartalax research measures whether cells read more or less of some instructions. A change can be measured without knowing all the steps that caused it.",
  "Cartalax is associated with a three-part chain called AED. Researchers tested cells that can develop into other cell types. They measured instructions including IGF1, which tells a cell how to make a growth-related message.",
  "One proposed idea is that very short peptides interact with the cell’s stored instructions or proteins around them. That is an idea to test. A changed reading does not prove direct contact with those instructions.",
  "Lab-grown cells exposed to the AED peptide changed the activity of some genes, or built-in instructions. The test did not show cartilage repair from a product.","Stem cells grown in a lab","32399807","The first target remains uncertain. These findings do not prove cartilage repair."),
 "sermorelin":guide(
  "How a short copy of a natural message can trigger hormone release.",
  "The pituitary is a small organ that releases hormones, or chemical messages. Sermorelin copies part of a message called GHRH. It can attach to a protein on the gland’s cells and start steps that release stored growth hormone. It does not supply growth hormone itself.",
  "The copied part has 29 small building blocks. A matching protein on the cell responds to it and starts the release message inside. Other signals can change or oppose that response.",
  "Scientists study how changes to a peptide affect its fit and breakdown. The linked design paper tested another changed form. It provides background but cannot prove that this supplier’s Sermorelin acts the same way.",
  "The linked design study examined related GHRH-like peptides and attachment to a carrier protein. It is background research, not a direct test of this supplier’s Sermorelin.","Related-peptide design research","15817669","Related designs are not interchangeable, and the source does not validate this vial."),
 "kisspeptin":guide(
  "How one nerve-cell message starts the next message in a chain.",
  "Nerve cells are tiny living parts that pass messages. Kisspeptin attaches to a protein on certain nerve cells. They can then release a second message, called GnRH. It reaches a small organ called the pituitary and helps control more hormone messages. Scientists study each step in this chain.",
  "The first protein is called KISS1R. It responds when the matching chemical attaches. That changes how easily the nerve cell sends its next message. Scientists can measure the cell’s electrical activity and released chemicals.",
  "The later messages are called LH and FSH. Kisspeptin does not supply these hormones directly; it acts earlier in the chain. The partner lists the 10-part form, so studies of other forms need separate checks.",
  "The experiments linked the kisspeptin-responsive protein to release of GnRH, the next message in the chain. Related work measured changes in nerve-cell activity.","Nerve-cell and hormone-signal research","15665093","These findings do not establish reproductive or other personal-use benefits from this vial."),
 "dihexa":guide(
  "An idea about nerve-cell connections whose key supporting paper was withdrawn.",
  "Nerve cells are tiny living parts that pass messages to one another. An earlier idea said Dihexa changed a message involved in making connections between them. But a key paper was retracted in 2025. Retracted means withdrawn from the research record. That paper cannot be treated as proof that the idea is true.",
  "The proposed message was HGF. It attaches to a protein called c-Met and can start steps inside a cell. The withdrawn paper linked Dihexa to this process and to changes in nerve-cell connections.",
  "A withdrawn paper changes how a claim must be read. The old explanation is still a hypothesis, which means an idea to test. Sound new evidence would be needed before presenting it as an established explanation.",
  "The linked record is a notice that the earlier HGF/c-Met paper was withdrawn in 2025. It warns about the evidence; it does not support the earlier claim.","Retraction notice","40312093","A retracted paper cannot support a confident mechanism or memory-benefit claim."),
 "vip":guide(
  "How one chemical message changes salt and fluid movement in certain cell tests.",
  "Cells are tiny living parts of tissue. VIP attaches to proteins on some cells and starts messages inside. In some gut cells, these messages affect the movement of salt and water. Other cells do different jobs, so the same message does not produce the same result everywhere.",
  "The proteins that respond to VIP are called VPAC1 and VPAC2. When VIP attaches, they can increase a small chemical called cAMP inside the cell. It passes the message to other parts.",
  "Scientists measure the message and the cell’s next action, such as salt movement. The type of cell changes what can happen next. One response in a test does not establish a useful effect in every tissue.",
  "Cell experiments measured VIP-related messages, including changes in cAMP, a chemical that passes the message onward. Other work examined where the VIP-responsive proteins occur in gut cells.","Cell-receptor research","10933794","A receptor response does not establish a useful result in every tissue or from this product."),
 "ara-290":guide(
  "Whether a small copied piece of a signal protein changes a cell’s stress response.",
  "Cells are tiny living parts of tissue. Stress, such as a harmful chemical, can change how they work or cause them to die. ARA-290 copies a small part of EPO, a larger signal protein. Researchers test whether this small part changes stress responses. The full explanation is still being studied.",
  "Full EPO sends messages involved in making red blood cells. ARA-290 was designed to study a different route. One proposed idea involves two proteins joining together to respond to the peptide.",
  "Those proposed parts include an EPO-responsive protein and one called CD131. Researchers measure stress messages and cell death. A changed measurement does not make the proposed route a general command to repair tissue.",
  "The cited work measured cell-stress messages and steps linked to cell death after ARA290 exposure. It did not establish a tissue-repair result from this supplier’s product.","Experimental stress-response research","36085231","The proposed route must be kept separate from claims of tissue protection or repair."),
 "pinealon":guide(
  "How cells respond when chemicals that can damage their parts build up.",
  "Cells are tiny living parts of tissue. Their normal work can make reactive chemicals, which readily change other chemicals they touch. Too many can damage cell parts. Pinealon tests measured fewer of some of these chemicals and changes in cell messages. The first cause of those changes is not settled.",
  "Scientists measured a message system called ERK, which helps control how cells respond and grow. They checked when that system became active, along with signs of chemical stress inside cells.",
  "Fewer reactive chemicals do not prove that Pinealon directly removes them. It could change how they are made or affect another step. More tests are needed to work out the whole chain of events.",
  "Cell tests found lower levels of free radicals, one type of reactive chemical. They also found changes in the timing of ERK, a system that passes messages inside cells.","Cell experiments","21978084","These findings do not establish a brain or personal-use benefit from the product."),
 "ahk-cu":guide(
  "How a copper-holding chain affects lab-grown cells from the base of a hair.",
  "A hair grows from a small pocket called a follicle. Cells at the base send messages that help control it. AHK-Cu is a short chemical chain that holds copper. Researchers tested how it changed these cells in a lab. This does not prove hair growth from the product.",
  "Cells are tiny living parts of tissue. The study tested isolated hair follicles and cells from their base outside the body. Scientists measured cell growth and messages linked to whether cells live or die.",
  "Some measurements changed, but others were not clear enough to count as a finding. The first steps behind the response remain uncertain. AHK-Cu and GHK-Cu also differ by one building block and are not the same molecule.",
  "The study found changes in isolated follicles and growth of cells from their base. Some cell-death results did not reach statistical significance: the test could not clearly separate the measured difference from chance.","Isolated human follicles and cultured cells","17703734","A lab-grown follicle is not a trial showing a cosmetic benefit from this product."),
};

/** Preserve the finished-liquid evidence boundary while explaining the ingredient. */
const sprays:Record<string,string>={"ghkcu-spray":"ghk-cu","nad-plus-spray":"nad-plus","semax-spray":"semax","selank-spray":"selank","pt-141-spray":"pt-141","melanotan-ii-spray":"melanotan-ii","dsip-spray":"dsip","bpc-tb-spray":"wolverine-stack","bpc-spray":"bpc-157"};
for(const [id,parent] of Object.entries(sprays)){
 const source=base[parent];
 base[id]={...source,
  study:`${source.study} The prepared liquid is a separate research question.`,
  how:`${source.how} The cited research does not test this spray.`,
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
 ["Cell","A tiny living part of tissue. A cell takes in materials, does chemical work and responds to its surroundings."],
 ["Protein","A chain of small building blocks folded into a shape that does a job, such as carrying a message or helping a reaction."],
 ["Peptide","A short chain of amino acids. Amino acids are small chemicals that join together, like beads on a string."],
 ["Molecule","A tiny group of atoms joined together. Water is made of water molecules. Different groups can do different jobs."],
 ["Hormone","A chemical message made in one place that can change what cells do somewhere else."],
 ["Receptor","A protein that starts steps inside a cell when a matching chemical attaches. It can be on the cell’s surface or inside it."],
 ["Enzyme","A protein that helps turn one chemical into another more quickly, like helping break a large piece into smaller pieces."],
 ["Cell study","A test on cells grown outside the body. It is not a trial in people."],
 ["Animal study","A test in animals under set conditions. Its results may not carry over to people."],
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
