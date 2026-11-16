import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')

const p = (...paras) => paras.map((t) => `<p>${t}</p>`).join('')
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const ol = (items) => `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`
const section = (heading, body) => ({ type: 'text', heading, body })

const planningCta = (headline, bullets) => ({
  type: 'cta',
  ctaVariant: 'boxed',
  cta: {
    headline,
    body: 'Our platform supports regulatory-aware sourcing for Reference Listed Drugs (RLDs), comparator drugs, and reference products for BE studies.',
    bullets,
    buttons: [
      { label: 'View Available Products', to: '/products' },
      { label: 'Submit Requirement', to: '/request-quote' },
    ],
  },
})

const bannerCta = () => ({
  type: 'cta',
  ctaVariant: 'banner',
  cta: {
    headline: 'Looking for Comparator Products for a Study?',
    body: 'Search available comparator products or submit a sourcing request for your development program.',
    bullets: [],
    buttons: [
      { label: 'Search Product Catalog', to: '/products' },
      { label: 'Request Quote', to: '/request-quote' },
    ],
  },
})

const defaultPlanning = [
  'Comparator availability',
  'Expiry limitations',
  'Batch traceability',
  'Documentation requirements',
  'Multi-market reference alignment',
]

const articles = [
  {
    slug: 'batch-selection-considerations-rlds',
    title: 'Batch Selection Considerations for RLDs in Bioequivalence Studies',
    excerpt:
      'Explains why RLD batch selection matters in bioequivalence study planning, covering batch traceability, expiry windows, storage and handling, and single- vs multi-batch sourcing considerations.',
    tags: ['RLD', 'Batch Selection', 'Bioequivalence'],
    publishedAt: '2026-09-20',
    blocks: [
      section(
        '',
        p(
          'Correct identification of the Reference Listed Drug (RLD) is an important step in planning a bioequivalence (BE) study. However, identifying the appropriate reference product does not necessarily resolve every practical consideration associated with the physical product used in the study.',
          'Commercially available RLDs may exist across different batches, manufacturing periods, expiry windows, and distribution channels.',
          'For development teams, batch selection therefore involves more than product identity alone. Factors such as batch traceability, remaining shelf life, storage history, and availability may influence study planning and the documentation supporting the comparator used in a BE program.',
          'Understanding these considerations helps connect regulatory reference selection with practical study execution.',
        ),
      ),
      section(
        'Why RLD Batch Selection Matters',
        p(
          'In a bioequivalence study, the RLD serves as the physical comparator against which the test product is evaluated.',
          'Pharmacokinetic parameters such as AUC and Cmax are generated using the products administered during the study. The characteristics and integrity of the physical RLD supplied for study use therefore form part of the overall study context.',
          'Commercial pharmaceutical products are manufactured in batches, and some degree of batch-to-batch variability may occur within established product specifications.',
          'This does not mean that one commercial batch should automatically be considered preferable to another. Rather, it means that development teams may need to consider the characteristics and suitability of the available batch in the context of the intended study.',
          'Batch selection is therefore an operational consideration that can support a well-planned BE program.',
        ),
      ),
      section(
        'Confirming the Correct Reference Product',
        p(
          'Before evaluating individual batches, the first consideration remains correct identification of the reference product.',
          'For a U.S.-focused ANDA program, development teams typically confirm the relevant reference designation using the applicable FDA resources and current regulatory information. As discussed in our <a href="/insights/reference-listed-drug-rld">explainer on what an RLD is and why it matters</a>, this identification step anchors every downstream sourcing and documentation decision.',
          'Once the appropriate reference product has been identified, the sourcing process moves from regulatory identification to physical supply. At this stage, teams may need to confirm:',
        ) +
          ul([
            'Product name, strength, and dosage form',
            'Manufacturer or marketer information',
            'Market of origin',
            'Batch or lot number',
            'Expiry date',
            'Quantity available',
          ]) +
          p(
            'Maintaining alignment between the product identified during development planning and the physical product obtained for study use supports documentation consistency.',
          ),
      ),
      section(
        'Considering Batch-to-Batch Variability',
        p(
          'Commercial batches of the same RLD are manufactured to approved specifications, but this does not imply that every measurable characteristic will be identical across all batches.',
          'For certain development activities, teams may evaluate characteristics such as dissolution behavior when planning formulation development or comparative studies.',
          'Where batch variability is relevant to a particular development program, the appropriate approach depends on the study objective, product characteristics, available data, and applicable regulatory expectations.',
          'It is therefore important to avoid treating batch selection as a universal formula.',
          'The significance of any observed batch-to-batch differences should be interpreted within the broader development and regulatory context rather than assuming that variation alone determines the suitability of a batch.',
        ),
      ),
      section(
        'Expiry Window and Study Timelines',
        p(
          'Remaining shelf life is another practical consideration when sourcing an RLD for BE studies.',
          'A batch may be commercially available and correctly identified but have an expiry date that does not align comfortably with the planned study timeline.',
          'Development teams may need sufficient time for:',
        ) +
          ul([
            'Procurement and international shipment',
            'Importation and customs procedures',
            'Receipt and inventory processing',
            'Study preparation',
            'Study execution',
            'Related analytical activities',
          ]) +
          p(
            'A limited expiry window can reduce operational flexibility if study schedules change or logistical delays occur.',
            'For this reason, expiry information is commonly considered before procurement rather than after the product has reached the study site.',
            'The appropriate remaining shelf life depends on the specific development program and planned use of the product.',
          ),
      ),
      section(
        'Batch Traceability and Documentation',
        p(
          'Traceability helps establish the identity and history of the physical RLD supplied for development use.',
          'Depending on the sourcing route and available commercial documentation, relevant records may include information relating to:',
        ) +
          ul([
            'Product identity',
            'Batch or lot number',
            'Expiry date',
            'Quantity supplied',
            'Source market',
            'Supply-chain documentation',
            'Storage and transportation conditions, where applicable',
          ]) +
          p(
            'The exact documentation available can vary by product, market, supplier, and distribution pathway.',
            'Accordingly, development teams should establish their documentation requirements before sourcing rather than assume that every commercial batch will be accompanied by the same records.',
            'Clear batch-level documentation can also help maintain consistency between sourcing records, study documentation, and subsequent regulatory submission materials.',
          ),
      ),
      section(
        'Storage and Handling Considerations',
        p(
          'Batch suitability does not depend only on the information printed on the package.',
          'The conditions under which the product is stored and transported may also be relevant to maintaining product integrity.',
          'RLDs should be handled in accordance with the applicable labeled storage conditions throughout the supply process.',
          'For products requiring temperature-controlled transportation or storage, additional planning may be necessary to maintain appropriate conditions and supporting records.',
          'Storage and handling considerations become particularly important when an RLD is sourced internationally and passes through multiple stages before reaching the study site.',
          'The objective is to maintain the integrity and traceability of the physical comparator from sourcing through study use.',
        ),
      ),
      section(
        'Single-Batch vs Multi-Batch Requirements',
        p(
          'Not every development program has the same RLD quantity or batch requirements.',
          'A study may be conducted using material from a particular batch, while other development activities may involve additional quantities or batches depending on the program design.',
          'Whether multiple RLD batches should be evaluated or sourced is a program-specific decision. Relevant considerations may include:',
        ) +
          ul([
            'Study design',
            'Product characteristics',
            'Development objectives',
            'Quantity requirements',
            'Batch availability',
            'Regulatory strategy',
          ]) +
          p(
            'Using multiple batches should not automatically be interpreted as a regulatory requirement, nor should using a single batch be treated as universally sufficient.',
            'The appropriate approach depends on the circumstances of the development program and applicable regulatory expectations.',
          ),
      ),
      section(
        'Implications for RLD Sourcing',
        p(
          'Batch selection illustrates why RLD sourcing in generic development is not solely an availability exercise.',
          'The question is not simply: Is the RLD available?',
          'Development teams may also need to ask: Which batch is available, what is its remaining shelf life, what documentation can be provided, and does the available supply align with the intended study timeline and use?',
          'Addressing these questions early can provide greater visibility during BE study planning and reduce the operational uncertainty associated with obtaining additional material later in the program.',
          'This is where regulatory identification, study planning, and pharmaceutical sourcing intersect. As covered in our <a href="/insights/rld-used-in-be-studies-vs-anda-filings">article on how an RLD is used in BE studies vs ANDA filings</a>, the same physical comparator carries different obligations across the development lifecycle.',
        ),
      ),
      planningCta('Sourcing an RLD Batch for a BE Study?', [
        'Batch and expiry availability',
        'Traceability documentation',
        'Storage and transport conditions',
        'Multi-market reference alignment',
      ]),
      section(
        'Key Takeaways',
        ul([
          'The physical batch used in a study introduces practical considerations beyond regulatory designation.',
          'Batch-to-batch variability should be evaluated in the context of the product, study objective, and applicable regulatory expectations.',
          'Remaining shelf life should be considered against procurement, logistics, and study timelines.',
          'Batch-level traceability and available documentation support consistency from sourcing through study use.',
          'Storage and handling should remain aligned with applicable labeled conditions.',
          'Single-batch or multi-batch strategies depend on the specific development program rather than a universal rule.',
        ]) +
          p(
            'Selecting an RLD batch is therefore not simply a procurement decision. It is an operational component of bioequivalence planning that connects the designated regulatory reference with the physical product ultimately used to generate study data.',
          ),
      ),
      bannerCta(),
    ],
  },
  {
    slug: 'dissolution-data-reduce-in-vivo-be-studies',
    title: 'When Can Dissolution Data Reduce the Need for In-Vivo BE Studies?',
    excerpt:
      'Explains when dissolution data may support a biowaiver of in-vivo bioequivalence studies, covering BCS-based waivers, additional-strength bridging evidence, and reference product considerations.',
    tags: ['Biowaiver', 'BCS', 'Bioequivalence'],
    publishedAt: '2026-07-27',
    blocks: [
      section(
        '',
        p(
          'In-vivo bioequivalence (BE) studies are commonly used to compare the rate and extent of drug absorption between a proposed generic product and the relevant reference product.',
          'However, an in-vivo study may not be required in every development scenario.',
          'Under defined regulatory conditions, dissolution data—together with evidence relating to the drug substance, formulation, dosage form, and applicable regulatory framework—may support a request to waive certain in-vivo BE studies. This is generally referred to as a biowaiver.',
          'A biowaiver does not mean that similar dissolution profiles automatically establish bioequivalence. It means that, where accepted scientific and regulatory criteria are met, in-vitro evidence may be used instead of a specific in-vivo study.',
          'Understanding this distinction helps development teams determine when dissolution data may serve as supportive evidence and when an in-vivo comparison remains necessary.',
        ),
      ),
      section(
        'What Is a Biowaiver?',
        p(
          'A biowaiver is a regulatory waiver of an in-vivo bioequivalence study.',
          'Instead of generating comparative pharmacokinetic data in human subjects, the applicant may submit in-vitro and supporting scientific evidence to justify why the in-vivo study is not required.',
          'Biowaivers may be considered in situations such as:',
        ) +
          ul([
            'Eligible immediate-release products under the Biopharmaceutics Classification System',
            'Additional strengths of a product after BE has been demonstrated on one strength',
            'Certain product-specific circumstances identified in regulatory guidance',
          ]) +
          p(
            'The availability of a biowaiver depends on the product, dosage form, drug-substance characteristics, formulation, and applicable regulatory expectations.',
            'Dissolution data therefore support a biowaiver request. They do not independently create an entitlement to a waiver.',
          ),
      ),
      section(
        'BCS-Based Biowaivers',
        p(
          'The Biopharmaceutics Classification System, or BCS, categorizes drug substances according to their aqueous solubility and intestinal permeability.',
          'For certain immediate-release solid oral dosage forms, a BCS-based biowaiver may allow in-vitro evidence to be used instead of an in-vivo BE study.',
          'The assessment generally considers:',
        ) +
          ul([
            'Drug-substance solubility',
            'Drug-substance permeability',
            'Dosage-form characteristics',
            'Dissolution performance',
            'Formulation composition',
            'Potential effects of excipients',
            'Therapeutic and absorption-related risks',
          ]) +
          p(
            'The test and reference products are usually compared across defined dissolution conditions. However, dissolution similarity is only one part of the assessment—the drug substance and formulation must also satisfy the criteria of the applicable BCS framework.',
            'For this reason, a product cannot be considered eligible for a BCS-based biowaiver solely because it dissolves rapidly or shows an acceptable comparative dissolution profile.',
          ),
      ),
      section(
        'Role of Comparative Dissolution Data',
        p(
          'Comparative dissolution testing evaluates how the test and reference products release the active ingredient under controlled in-vitro conditions.',
          'The comparison may consider:',
        ) +
          ul([
            'Dissolution media',
            'Apparatus and agitation speed',
            'Sampling time points',
            'Number of units tested',
            'Variability within the results',
            'Similarity between the two profiles',
          ]) +
          p(
            'As discussed in our previous article on <a href="/insights/comparative-dissolution-profile-cdp-bioequivalence">Comparative Dissolution Profiles and bioequivalence</a>, the similarity factor f2 may be used, where appropriate, to compare dissolution profiles. An acceptable f2 result may support the conclusion that the profiles are similar under the tested conditions.',
            'However, similar dissolution profiles do not establish equivalent absorption in the body. Dissolution testing does not fully reproduce physiological factors such as:',
          ) +
          ul([
            'Gastric emptying',
            'Intestinal transit',
            'Permeability',
            'Food effects',
            'Metabolism',
            'Transporter activity',
          ]) +
          p(
            'Comparative dissolution data should therefore be interpreted within the relevant regulatory and scientific context.',
          ),
      ),
      section(
        'Biowaivers for Additional Strengths',
        p(
          'Dissolution data may also reduce the need to conduct a separate in-vivo BE study for every strength of a product.',
          'In a multiple-strength product line, an in-vivo study may be conducted using one selected strength. A waiver may then be requested for the remaining strengths where applicable criteria are met.',
          'Supporting considerations may include:',
        ) +
          ul([
            'The strengths are manufactured using the same process',
            'The formulations are proportionally similar or otherwise meet applicable compositional requirements',
            'The products use the same release mechanism',
            'The pharmacokinetics are appropriately understood',
            'Comparative dissolution supports consistent performance across strengths',
            'In-vivo BE has been demonstrated for the selected strength',
          ]) +
          p(
            'In this context, dissolution data function as bridging evidence—they help demonstrate that the additional strengths perform consistently with the strength evaluated in vivo.',
            'The strength selected for the BE study may depend on factors such as safety, dose proportionality, solubility, analytical sensitivity, and product-specific recommendations.',
          ),
      ),
      section(
        'When Dissolution Data May Not Be Sufficient',
        p(
          'Dissolution data may not adequately predict in-vivo performance for every drug product.',
          'Additional in-vivo evidence may still be required where the product presents characteristics such as:',
        ) +
          ul([
            'Modified-release behavior',
            'Narrow therapeutic index',
            'Low or variable permeability',
            'Site-specific absorption',
            'Complex formulation characteristics',
            'Excipients that may influence absorption',
            'Significant food effects',
            'Product-specific regulatory concerns',
          ]) +
          p(
            'In such situations, similar dissolution profiles may not provide sufficient assurance that the test and reference products will behave similarly in the body. This is why the acceptability of a biowaiver depends on more than the dissolution result alone.',
          ),
      ),
      section(
        'Product-Specific Guidance and Regulatory Expectations',
        p(
          'General guidance provides a scientific framework for bioequivalence and biowaivers. However, individual drug products may be subject to product-specific recommendations.',
          'These recommendations may address:',
        ) +
          ul([
            'Whether an in-vivo study is required',
            'The appropriate strength for testing',
            'Fasting or fed conditions',
            'Additional-strength waiver criteria',
            'Recommended dissolution methods',
            'Alternative in-vitro approaches',
            'Special characteristics of the drug or dosage form',
          ]) +
          p(
            'Development teams should therefore assess both general guidance and current product-specific recommendations before finalizing the BE strategy. Where the proposed approach differs from the published recommendation, regulatory consultation may be appropriate.',
            'As covered in our article on <a href="/insights/cdp-required-in-anda">whether a Comparative Dissolution Profile is required in an ANDA</a>, the role and extent of dissolution data in a submission can vary depending on the product and regulatory pathway.',
          ),
      ),
      section(
        'Implications for Reference Product Selection',
        p(
          'Where dissolution data will support a biowaiver request, correct reference product selection remains important.',
          'Development teams typically consider:',
        ) +
          ul([
            'Confirmation of the applicable reference product',
            'Alignment with the target submission market',
            'Correct strength and dosage form',
            'Batch and expiry traceability',
            'Storage according to labeled conditions',
            'Sufficient quantity for testing',
            'Consistency between the sourced product and submission documentation',
          ]) +
          p(
            'A poorly documented, incorrectly identified, or improperly stored reference product may affect the reliability of comparative dissolution data. Reference product sourcing therefore remains part of the evidence chain supporting a biowaiver strategy.',
          ),
      ),
      planningCta('Planning an ANDA or BE Study?', defaultPlanning),
      section(
        'Key Takeaways',
        ul([
          'In-vivo BE studies remain a primary method of comparing test and reference drug products.',
          'Under defined regulatory conditions, dissolution data may support a waiver of certain in-vivo BE studies.',
          'BCS-based biowaivers apply only to eligible drug substances and qualifying dosage forms.',
          'Dissolution data may support waivers for additional strengths after BE has been demonstrated on one strength.',
          'Similar dissolution profiles do not independently establish bioequivalence.',
          'Product-specific guidance may determine whether an in-vitro or in-vivo approach is appropriate.',
          'Correct reference product identification, traceability, storage, and documentation remain important.',
          'Acceptance of a biowaiver depends on the totality of evidence submitted.',
        ]) +
          p(
            'Dissolution data can reduce the need for in-vivo BE testing when they are used within an accepted scientific and regulatory framework. The objective is not to replace in-vivo studies wherever possible, but to apply the appropriate evidence to the product, pathway, and development question being evaluated.',
          ),
      ),
      bannerCta(),
    ],
  },
]

// Remaining 5 articles appended below in same file via second write - for now write JSON of first 2 and continue
fs.writeFileSync(
  path.join(__dirname, 'articles-part1.json'),
  JSON.stringify(articles, null, 2),
)
console.log('part1', articles.map((a) => `${a.slug}:${a.blocks.length}`).join(', '))
