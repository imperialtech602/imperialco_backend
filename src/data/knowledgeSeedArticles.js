function p(...paragraphs) {
  return paragraphs.map((text) => `<p>${text}</p>`).join('')
}

function ul(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
}

function ol(items) {
  return `<ol>${items.map((item) => `<li>${item}</li>`).join('')}</ol>`
}

function section(heading, html) {
  return { type: 'text', heading, body: html }
}

const SUPPORT_INTRO = 'Our platform supports regulatory-aware sourcing for:'
const SUPPORT_BULLETS = [
  'Reference Listed Drugs (RLDs)',
  'Comparator drugs',
  'Reference products for BE studies',
]

function cta(variant, headline, body, bullets, buttons, extras = {}) {
  return {
    type: 'cta',
    ctaVariant: variant,
    cta: {
      headline,
      body,
      bullets,
      buttons,
      supportIntro: extras.supportIntro || '',
      supportBullets: extras.supportBullets || [],
    },
  }
}

/** Mid-article boxed CTA used by most articles. */
function planningCta() {
  return cta(
    'boxed',
    'Planning an ANDA or BE Study?',
    'Development timelines are often affected by:',
    [
      'Comparator availability',
      'Expiry limitations',
      'Batch traceability',
      'Documentation requirements',
      'Multi-market reference alignment',
    ],
    [
      { label: 'View Available Products', to: '/products' },
      { label: 'Submit Requirement', to: '/request-quote' },
    ],
    { supportIntro: SUPPORT_INTRO, supportBullets: SUPPORT_BULLETS },
  )
}

/** Mid-article boxed CTA for the batch-selection article. */
function batchCta() {
  return cta(
    'boxed',
    'Sourcing an RLD Batch for a BE Study?',
    'Development timelines are often affected by:',
    [
      'Batch and expiry availability',
      'Traceability documentation',
      'Storage and transport conditions',
      'Multi-market reference alignment',
    ],
    [
      { label: 'View Available Products', to: '/products' },
      { label: 'Submit Requirement', to: '/request-quote' },
    ],
    { supportIntro: SUPPORT_INTRO, supportBullets: SUPPORT_BULLETS },
  )
}

/** Full-width banner CTA placed after Key Takeaways. */
function bannerCta() {
  return cta(
    'banner',
    'Looking for Comparator Products for a Study?',
    'Search available comparator products or submit a sourcing request for your development program.',
    [],
    [
      { label: 'Search Product Catalog', to: '/products' },
      { label: 'Request Quote', to: '/request-quote' },
    ],
  )
}

export const KNOWLEDGE_SEED_ARTICLES = [
  // ---------------------------------------------------------------------------
  // 1. Batch selection
  // ---------------------------------------------------------------------------
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
      batchCta(),
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

  // ---------------------------------------------------------------------------
  // 2. Dissolution data and in-vivo BE studies
  // ---------------------------------------------------------------------------
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
      planningCta(),
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

  // ---------------------------------------------------------------------------
  // 3. Is a CDP required in an ANDA?
  // ---------------------------------------------------------------------------
  {
    slug: 'cdp-required-in-anda',
    title: 'Is a Comparative Dissolution Profile Required in an ANDA?',
    excerpt:
      'Clarifies whether a Comparative Dissolution Profile is required in an ANDA, how CDP differs from bioequivalence studies, and when dissolution data may receive greater regulatory attention.',
    tags: ['CDP', 'ANDA', 'Dissolution Testing'],
    publishedAt: '2026-06-22',
    blocks: [
      section(
        '',
        p(
          'A Comparative Dissolution Profile (CDP) is a commonly used analytical tool in generic drug development. By comparing the dissolution behavior of a test product and a reference product under defined in-vitro conditions, a CDP may provide supportive evidence regarding product similarity.',
          'Because dissolution testing is widely used throughout development programs, a common question arises: Is a Comparative Dissolution Profile required in an ANDA?',
          'The answer depends on the specific regulatory context, product characteristics, and supporting data package. While dissolution information often plays an important role in development and submission activities, regulatory requirements are product-specific and should be evaluated within the framework applicable to the proposed product.',
          'Understanding how dissolution data is used helps development teams align study planning, documentation, and submission strategy.',
        ),
      ),
      section(
        'What Is a Comparative Dissolution Profile (CDP)?',
        p(
          'A Comparative Dissolution Profile is an in-vitro comparison of the rate and extent of drug release between a test product and a reference product under defined experimental conditions.',
          'Dissolution testing is typically conducted across multiple media and time points to characterize release behavior.',
          'A CDP may be used to:',
        ) +
          ul([
            'Evaluate formulation similarity',
            'Compare manufacturing batches',
            'Assess development changes',
            'Support scientific understanding of product performance',
            'Contribute to regulatory submissions where appropriate',
          ]) +
          p(
            'Comparative dissolution studies generate data that can help characterize whether two products exhibit similar dissolution behavior under specified test conditions.',
            'As discussed in our previous article on <a href="/insights/comparative-dissolution-profile-cdp-bioequivalence">Comparative Dissolution Profiles and bioequivalence</a>, dissolution similarity is commonly assessed using approaches such as the similarity factor (f2), where applicable.',
          ),
      ),
      section(
        'How Dissolution Data Is Used in Generic Development',
        p(
          'Dissolution testing is routinely performed throughout the product lifecycle.',
          'Development teams may use dissolution data during:',
        ) +
          ul([
            'Formulation development',
            'Process optimization',
            'Scale-up activities',
            'Stability evaluation',
            'Bioequivalence planning',
            'Regulatory documentation preparation',
          ]) +
          p(
            'Because dissolution behavior can influence how a product performs in-vitro, dissolution studies often provide valuable supporting information during development.',
            'However, dissolution testing and bioequivalence testing serve different purposes.',
            'A Comparative Dissolution Profile evaluates drug release behavior under laboratory conditions, while bioequivalence studies evaluate systemic exposure under defined clinical conditions.',
            'For this reason, dissolution data should not be interpreted as a substitute for bioequivalence unless specifically supported within an applicable regulatory framework.',
          ),
      ),
      section(
        'Is a Comparative Dissolution Profile Always Required in an ANDA?',
        p(
          'There is no universal answer that applies to every product.',
          'ANDA requirements depend on multiple factors, including:',
        ) +
          ul([
            'Drug substance characteristics',
            'Dosage form',
            'Route of administration',
            'Product-specific guidance, where available',
            'Applicable regulatory expectations',
          ]) +
          p(
            'In many development programs, dissolution data forms part of the overall evidence package supporting product evaluation.',
            'Comparative dissolution information may be requested or expected in specific contexts, such as:',
          ) +
          ul([
            'Product characterization',
            'Demonstration of formulation consistency',
            'Supportive evidence accompanying other studies',
            'Situations where dissolution performance is a relevant scientific consideration',
          ]) +
          p(
            'However, the specific role and extent of dissolution data can vary depending on the product and regulatory pathway.',
            'Development teams should evaluate requirements using current regulatory guidance and product-specific considerations.',
          ),
      ),
      section(
        'The Relationship Between CDP and Bioequivalence',
        p(
          'Comparative dissolution profiles are frequently discussed alongside bioequivalence because both involve comparison between a test product and a reference product.',
          'Despite this connection, they serve distinct functions.',
          '<strong>Comparative Dissolution Profile</strong>',
          'A CDP evaluates:',
        ) +
          ul(['Drug release characteristics', 'Dissolution similarity', 'In-vitro product behavior']) +
          p('<strong>Bioequivalence Study</strong>', 'A BE study evaluates:') +
          ul([
            'Systemic drug exposure',
            'Pharmacokinetic parameters',
            'Comparative in-vivo performance',
          ]) +
          p(
            'The two approaches generate different types of evidence.',
            'In some regulatory scenarios, dissolution data may complement bioequivalence data by providing additional scientific context regarding product performance.',
            'Regulatory decisions, however, are based on the totality of evidence submitted.',
          ),
      ),
      section(
        'Situations Where Dissolution Data May Receive Greater Regulatory Attention',
        p(
          'Certain development programs place increased emphasis on dissolution characteristics.',
          'Examples may include:',
        ) +
          ul([
            'Immediate-release oral solid dosage forms',
            'Formulation changes during development',
            'Manufacturing process modifications',
            'Stability-related investigations',
            'Product-specific regulatory expectations',
          ]) +
          p(
            'In these situations, comparative dissolution information may help support scientific assessments regarding product consistency and performance.',
            'The extent of reliance on dissolution data depends on the specific regulatory framework applicable to the product.',
          ),
      ),
      section(
        'Documentation Considerations for Comparative Dissolution Studies',
        p(
          'As with other development activities, traceability and documentation are important considerations when generating dissolution data.',
          'Development teams typically prioritize:',
        ) +
          ul([
            'Clearly defined analytical methods',
            'Appropriate test conditions',
            'Reference product traceability',
            'Batch identification and documentation',
            'Data integrity controls',
            'Consistency of reporting',
          ]) +
          p(
            'Well-documented dissolution studies help support transparency and facilitate interpretation of generated data.',
            'Where a Reference Listed Drug (RLD) is used as the comparator product, maintaining traceability between the tested batch and supporting documentation remains an important operational consideration.',
          ),
      ),
      section(
        'Why Understanding CDP Requirements Matters',
        p(
          'Questions regarding dissolution requirements often arise early in development planning.',
          'Understanding the role of Comparative Dissolution Profiles can help teams:',
        ) +
          ul([
            'Plan analytical activities more effectively',
            'Align development strategies with regulatory expectations',
            'Support scientific decision-making',
            'Reduce uncertainty during submission preparation',
            'Improve coordination between formulation, analytical, and Regulatory Affairs teams',
          ]) +
          p(
            'Because requirements can differ between products and regulatory pathways, early assessment of dissolution expectations is often incorporated into development planning activities.',
          ),
      ),
      planningCta(),
      section(
        'Key Takeaways',
        ul([
          'A Comparative Dissolution Profile (CDP) compares the dissolution behavior of a test product and a reference product under defined in-vitro conditions.',
          'Dissolution testing is commonly used throughout generic drug development.',
          'A CDP and a bioequivalence study generate different types of evidence and serve different purposes.',
          'The role of dissolution data in an ANDA depends on product-specific and regulatory considerations.',
          'Comparative dissolution information may provide supportive scientific evidence within a broader development and submission strategy.',
          'Regulatory decisions are based on the totality of evidence submitted.',
        ]) +
          p(
            'A structured understanding of Comparative Dissolution Profiles helps development teams evaluate how dissolution data fits within broader bioequivalence, formulation, and regulatory planning activities.',
          ),
      ),
      bannerCta(),
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. What is a CDP and how does it support BE?
  // ---------------------------------------------------------------------------
  {
    slug: 'comparative-dissolution-profile-cdp-bioequivalence',
    title:
      'What Is a Comparative Dissolution Profile (CDP) and How Does It Support Bioequivalence?',
    excerpt:
      'Explains how Comparative Dissolution Profile testing supports bioequivalence planning, f2 similarity assessment, BCS biowaiver evaluation, and why batch traceability matters for reference products.',
    tags: ['CDP', 'Bioequivalence', 'Dissolution'],
    publishedAt: '2026-05-18',
    blocks: [
      section(
        '',
        p(
          'A Comparative Dissolution Profile (CDP) is an in vitro dissolution assessment used to compare the drug release behavior of a test product against a reference product under defined conditions. In generic drug development, Comparative Dissolution Profile testing is commonly used to support formulation development, assess similarity between products, and contribute to broader bioequivalence planning.',
          'Within ANDA bioequivalence studies and generic drug testing programs, dissolution profile comparison helps development teams evaluate whether a proposed product demonstrates release characteristics that are comparable to the selected reference product or Reference Listed Drug (RLD). While a Comparative Dissolution Profile does not replace in vivo bioequivalence testing in most cases, it can support formulation understanding, risk assessment, and, in specific circumstances, BCS biowaiver strategies aligned with FDA dissolution guidelines.',
        ),
      ),
      section(
        'What Is a Comparative Dissolution Profile (CDP)?',
        p(
          'A Comparative Dissolution Profile (CDP) evaluates the rate and extent of pharmaceutical dissolution between two products across multiple time points under standardized test conditions. In pharmaceutical dissolution and drug release testing, the objective is to characterize how the active ingredient dissolves over time in specified dissolution media.',
          'The resulting dissolution study data allows comparison between:',
        ) +
          ul([
            'A test (generic) product',
            'A reference product or comparator product',
            'A Reference Listed Drug (RLD), where applicable',
          ]) +
          p(
            'Comparative Dissolution Profile methodology typically involves testing multiple units of each product using validated dissolution conditions and comparing release behavior across defined sampling intervals. Dissolution profile testing is considered part of broader pharmaceutical quality control and development characterization activities.',
          ),
      ),
      section(
        'How Does a CDP Support Bioequivalence?',
        p(
          'In bioequivalence testing, dissolution behavior is relevant because drug release characteristics may influence systemic exposure. A Comparative Dissolution Profile supports bioequivalence development by helping teams:',
        ) +
          ul([
            'Assess formulation similarity during development',
            'Identify differences in release behavior between products',
            'Support dissolution profile comparison across batches',
            'Evaluate consistency during scale-up or manufacturing changes',
            'Contribute supporting evidence within a bioequivalence study strategy',
          ]) +
          p(
            'In some regulatory pathways, in vitro dissolution data may also support BCS biowaiver considerations when eligibility criteria are met. The role of a Comparative Dissolution Profile therefore extends beyond routine analytical testing. It contributes to development understanding and supports alignment between formulation performance and regulatory expectations.',
          ),
      ),
      section(
        'Role of the Similarity Factor f2 in Dissolution Profile Comparison',
        p(
          'Dissolution profile comparison commonly evaluates similarity between profiles using statistical and mathematical approaches. One widely referenced metric is the similarity factor f2. The Similarity Factor f2 is used to compare the closeness between two dissolution curves across multiple sampling points.',
          'Under FDA dissolution guidelines and related regulatory frameworks, f2 analysis may support evaluation of dissolution profile similarity when applicable conditions are satisfied. An f2 assessment generally considers:',
        ) +
          ul([
            'Comparable dissolution conditions',
            'Appropriate sampling intervals',
            'Representative batch selection',
            'Acceptable variability across units',
          ]) +
          p(
            'Similarity assessments are interpreted within the broader context of the overall development program and should align with applicable regulatory guidance. An acceptable dissolution profile comparison does not independently establish bioequivalence. Regulatory conclusions are based on the totality of evidence submitted.',
          ),
      ),
      section(
        'Key Considerations in CDP Methodology',
        p(
          'A Comparative Dissolution Profile is generally performed using standardized dissolution study methodology under controlled laboratory conditions. Key considerations in CDP methodology may include:',
        ) +
          ul([
            'Selection of dissolution media',
            'Appropriate apparatus and rotation speed',
            'Defined sampling time points',
            'Validated analytical method performance',
            'Batch traceability and documentation',
            'Storage and handling integrity of tested products',
          ]) +
          p(
            'Because pharmaceutical dissolution behavior can be influenced by formulation characteristics, manufacturing variability, and storage conditions, representative batch selection remains an important consideration. In development programs involving comparator drugs or RLD sourcing, traceability and controlled handling support defensible dissolution data generation.',
          ),
      ),
      section(
        'CDP and BCS Biowaiver Considerations',
        p(
          'Comparative Dissolution Profiles are frequently discussed in the context of BCS biowaiver pathways. Under certain conditions, in vitro dissolution data may reduce or support the need for additional in vivo bioequivalence studies. Eligibility depends on factors such as:',
        ) +
          ul([
            'Drug substance classification',
            'Dissolution characteristics of the test and reference products',
            'Formulation similarity',
            'Applicable FDA dissolution guidelines and regional expectations',
          ]) +
          p(
            'Biowaiver eligibility is evaluated within specific regulatory frameworks and should be assessed in accordance with applicable guidance. Comparative dissolution studies therefore function as one component of a broader regulatory and scientific assessment.',
          ),
      ),
      section(
        'Operational Considerations in Comparative Dissolution Studies',
        p(
          'Because Comparative Dissolution Profiles rely on meaningful comparison between products, operational considerations can affect data quality and interpretability. Development teams commonly prioritize:',
        ) +
          ul([
            'Confirmed reference product identification',
            'Representative commercial batch availability',
            'Batch and expiry traceability',
            'Controlled storage and handling conditions',
            'Consistency between sourced product and study documentation',
          ]) +
          p(
            'These considerations help support reliable dissolution study outcomes and regulatory clarity during development and submission activities.',
          ),
      ),
      planningCta(),
      section(
        'Key Takeaways',
        ul([
          'A Comparative Dissolution Profile (CDP) is an in vitro dissolution comparison between a test product and a reference product.',
          'CDP bioequivalence support activities help evaluate similarity in drug release behavior during generic drug development.',
          'Dissolution profile testing contributes to formulation assessment, bioequivalence planning, and BCS biowaiver evaluation.',
          'Similarity Factor f2 is commonly used in dissolution profile comparison when appropriate conditions are met.',
          'Comparative dissolution studies support development understanding but do not independently establish bioequivalence.',
          'Representative batch selection, traceability, and controlled handling support defensible pharmaceutical dissolution data.',
        ]) +
          p(
            'Structured dissolution planning supports alignment between in vitro characterization, bioequivalence strategy, and regulatory expectations in generic development programs.',
          ),
      ),
      bannerCta(),
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. RLD in BE studies vs ANDA filings
  // ---------------------------------------------------------------------------
  {
    slug: 'rld-used-in-be-studies-vs-anda-filings',
    title: 'How an RLD Is Used in Bioequivalence (BE) Studies vs ANDA Filings',
    excerpt:
      'Explains how the RLD shifts from a physical comparator in BE study execution to a regulatory anchor in ANDA filings, and why alignment and traceability support defensible submissions.',
    tags: ['RLD', 'Bioequivalence', 'ANDA'],
    publishedAt: '2026-04-29',
    blocks: [
      section(
        '',
        p(
          'A Reference Listed Drug (RLD) plays a central role across both bioequivalence (BE) studies and ANDA (Abbreviated New Drug Application) submissions. While the same product is referenced in both contexts, its role differs in function and regulatory interpretation.',
          'In BE studies, the RLD is the physical comparator used to generate data. In an ANDA, the RLD serves as the regulatory reference framework against which that data is interpreted.',
          'Understanding this distinction helps align study execution with submission strategy and supports regulatory clarity.',
        ),
      ),
      section(
        'Role of the RLD in Bioequivalence (BE) Studies',
        p(
          'In a bioequivalence (BE) study, the Reference Listed Drug serves as the physical comparator product. The test (generic) product is administered alongside the RLD, and pharmacokinetic parameters — such as AUC and Cmax — are statistically compared.',
          'The RLD therefore defines the benchmark exposure profile. Demonstrating bioequivalence means demonstrating statistical equivalence to the Reference Listed Drug.',
          'Operational considerations that directly affect BE study integrity include:',
        ) +
          ul([
            'Correct identification of the designated RLD',
            'Representative commercial batch selection',
            'Batch and expiry traceability',
            'Storage and handling aligned with labeled conditions',
          ]) +
          p(
            'Improper RLD identification or inadequate traceability may introduce regulatory questions during ANDA review.',
          ),
      ),
      section(
        'Role of the RLD in an ANDA Submission',
        p(
          'In an ANDA submission, the Reference Listed Drug functions as the regulatory anchor. The applicant must demonstrate that the proposed product is pharmaceutically equivalent and bioequivalent to the RLD.',
          'Within the ANDA, the RLD is referenced to:',
        ) +
          ul([
            'Define the basis of comparison',
            'Support pharmaceutical equivalence claims',
            'Contextualize bioequivalence study results',
            'Align product characteristics and labeling references',
          ]) +
          p(
            'Equivalence to the Reference Listed Drug is necessary in an abbreviated pathway, but regulatory decisions are based on the totality of evidence submitted.',
          ),
      ),
      section(
        'BE Study vs ANDA: Functional Difference',
        p(
          'While the same RLD underpins both stages, its role differs in function.',
          'In a BE study, the RLD is:',
        ) +
          ul([
            'The physical comparator product',
            'The source of in-vivo exposure data',
            'Part of study execution',
          ]) +
          p('In an ANDA submission, the RLD is:') +
          ul([
            'The designated regulatory reference',
            'The benchmark cited in documentation',
            'The framework for interpreting submitted data',
          ]) +
          p('This distinction reflects the transition from data generation to regulatory evaluation.'),
      ),
      section(
        'Why This Distinction Matters',
        p(
          'Misunderstanding the dual role of the RLD can lead to misalignment between study design and submission expectations.',
          'For example:',
        ) +
          ul([
            'A BE study may be conducted correctly from a technical standpoint',
            'But if the RLD designation referenced in the ANDA does not align with the product used in the study, regulatory questions may arise',
          ]) +
          p('Regulatory review focuses on consistency between:') +
          ul([
            'The designated RLD',
            'The comparator used in studies',
            'The data presented in the submission',
          ]) +
          p('Alignment across these elements supports a defensible submission.'),
      ),
      section(
        'Implications for Development Planning',
        p(
          'Because the RLD bridges study execution and regulatory evaluation, early alignment is a standard consideration in development programs.',
          'Development teams typically prioritize:',
        ) +
          ul([
            'Confirmed RLD designation in the target submission market',
            'Alignment between study comparator and regulatory reference',
            'Traceability from sourcing through study use',
            'Consistency between study documentation and ANDA content',
          ]) +
          p(
            'These considerations help ensure that data generated in BE studies translates clearly into regulatory submissions.',
          ),
      ),
      planningCta(),
      section(
        'Key Takeaways',
        ul([
          'A Reference Listed Drug (RLD) plays both a study and regulatory role in generic development.',
          'In a BE study, the RLD is the physical comparator product.',
          'In an ANDA, the RLD is the regulatory reference framework.',
          'Alignment between study execution and submission supports regulatory clarity.',
          'Accurate identification, traceability, and consistency of the RLD support defensible ANDA submissions.',
        ]) +
          p(
            'A structured development program integrates the role of the Reference Listed Drug across both study design and regulatory strategy.',
          ),
      ),
      bannerCta(),
    ],
  },

  // ---------------------------------------------------------------------------
  // 6. Comparator drug vs RLD
  // ---------------------------------------------------------------------------
  {
    slug: 'comparator-drug-vs-reference-listed-drug',
    title: 'Comparator Drug vs Reference Listed Drug: Key Differences Explained',
    excerpt:
      'Clarifies where comparator and RLD terms overlap, where they differ, and why terminology precision helps avoid regulatory ambiguity in multi-market development programs.',
    tags: ['Comparator Product', 'RLD', 'Global Programs'],
    publishedAt: '2026-04-07',
    blocks: [
      section(
        '',
        p(
          'In regulatory and development discussions, the terms “comparator drug” and “Reference Listed Drug (RLD)” are sometimes used interchangeably. While they are closely related, they are not always identical in regulatory meaning.',
          'Clarifying the distinction helps avoid misalignment during bioequivalence planning, documentation preparation, and global development strategy.',
        ),
      ),
      section(
        'What Is a Comparator Drug?',
        p(
          'A comparator drug is the product against which a test product is compared in a study. The comparison may be conducted to assess:',
        ) +
          ul([
            'Bioequivalence',
            'Dissolution similarity',
            'Clinical performance',
            'Relative pharmacokinetics',
          ]) +
          p(
            'The term “comparator” is functional. It describes the role the product plays in the study, rather than its regulatory designation.',
          ),
      ),
      section(
        'What Is a Reference Listed Drug (RLD)?',
        p(
          'An RLD is a comparator with a specific regulatory designation. It is identified by the relevant authority as the reference standard for demonstrating equivalence in an abbreviated pathway.',
          'All RLDs function as comparators in bioequivalence studies. However, not all comparators are formally designated RLDs.',
          'This distinction becomes particularly relevant in multi-jurisdictional programs.',
        ),
      ),
      section(
        'When Are Comparator and RLD the Same?',
        p(
          'In many U.S.-focused ANDA submissions, the comparator used in the BE study is the FDA-designated RLD. In such cases, the functional and regulatory roles align.',
          'The product is:',
        ) +
          ul([
            'The designated regulatory reference',
            'The physical product used in the study',
            'The benchmark cited in the submission',
          ]) +
          p(
            'In this scenario, the terms are often used interchangeably in informal discussion, though precise terminology remains important in formal documentation.',
          ),
      ),
      section(
        'When Can They Differ?',
        p(
          'In global development programs, sponsors may select comparators based on the expectations of the target submission market.',
          'For Example:',
        ) +
          ul([
            'A study conducted for one region may use a locally sourced comparator aligned with that market’s regulatory framework.',
            'A development program targeting multiple jurisdictions may need to consider whether the selected comparator aligns with each authority’s reference expectations.',
          ]) +
          p(
            'In such cases, the comparator used in a study may not correspond to the RLD designation in another jurisdiction.',
            'This is why regulatory planning typically addresses:',
          ) +
          ul([
            'Target submission market',
            'Reference product designation in that market',
            'Study design alignment',
          ]),
      ),
      section(
        'Why the Distinction Matters',
        p('The distinction between comparator and RLD matters for several reasons:') +
          ol([
            'Regulatory clarity: Submissions must clearly identify the designated reference product.',
            'Study validity: The comparator selected must align with regulatory expectations.',
            'Documentation consistency: The product referenced in the submission must correspond to the product used in studies.',
          ]) +
          p('Misalignment can introduce regulatory questions during review.'),
      ),
      section(
        'Implications for Sourcing and Traceability',
        p(
          'Whether a product is described as a comparator or an RLD, development programs typically prioritize:',
        ) +
          ul([
            'Confirmed product identity',
            'Batch and expiry transparency',
            'Storage and handling integrity',
            'Traceability from origin to study use',
          ]) +
          p(
            'Where a product carries formal RLD designation, additional care is often taken to ensure consistency between designation and physical supply.',
          ),
      ),
      planningCta(),
      section(
        'Key Takeaways',
        ul([
          'A comparator drug is any product used as a reference in a study.',
          'An RLD is a comparator with formal regulatory designation.',
          'All RLDs function as comparators, but not all comparators are RLDs.',
          'Terminology precision supports regulatory clarity.',
          'Alignment between comparator selection and regulatory expectations is a standard consideration in generic development.',
        ]) +
          p(
            'Clear use of terminology reflects regulatory literacy and reduces ambiguity during development and submission processes.',
          ),
      ),
      bannerCta(),
    ],
  },

  // ---------------------------------------------------------------------------
  // 7. What is an RLD
  // ---------------------------------------------------------------------------
  {
    slug: 'reference-listed-drug-rld',
    title:
      'What Is a Reference Listed Drug (RLD) and Why It Matters in Generic Development',
    excerpt:
      'A structured explainer on how the FDA-designated RLD anchors pharmaceutical equivalence, comparator selection, and documentation consistency across development and submission stages.',
    tags: ['RLD', 'ANDA', 'Bioequivalence'],
    publishedAt: '2026-03-18',
    blocks: [
      section(
        '',
        p(
          'A Reference Listed Drug (RLD) is the regulatory benchmark used in generic drug development to demonstrate pharmaceutical equivalence and bioequivalence.',
          'A Reference Listed Drug (RLD) is the regulatory benchmark used in generic drug development to demonstrate pharmaceutical equivalence and bioequivalence. In an abbreviated pathway such as an ANDA (Abbreviated New Drug Application), the RLD defines the reference product against which a proposed generic product is compared.',
          'For Regulatory Affairs, formulation, and bioequivalence (BE) teams, understanding the role of the Reference Listed Drug is foundational. The RLD is not simply a comparator product — it is the designated regulatory reference that anchors development, study design, and submission structure.',
        ),
      ),
      section(
        'What Is a Reference Listed Drug (RLD)?',
        p(
          'A Reference Listed Drug (RLD) is a previously approved drug product that a regulatory authority designates as the reference standard for generic development. In the United States, RLD designations are identified in the FDA Orange Book. Similar reference frameworks exist in other regulated markets.',
          'The RLD establishes:',
        ) +
          ul([
            'The reference product identity',
            'Approved strength and dosage form',
            'Route of administration',
            'Labeling reference framework',
            'The product to which bioequivalence must be demonstrated',
          ]) +
          p(
            'To demonstrate pharmaceutical equivalence, a generic product must match the Reference Listed Drug in active ingredient, strength, dosage form, and route of administration, subject to regulatory allowances.',
          ),
      ),
      section(
        'Role of the RLD in Bioequivalence (BE) Studies',
        p(
          'In a bioequivalence (BE) study, the Reference Listed Drug serves as the physical comparator product. The test (generic) product is administered alongside the RLD, and pharmacokinetic parameters — such as AUC and Cmax — are statistically compared.',
          'The RLD therefore defines the benchmark exposure profile. Demonstrating bioequivalence means demonstrating statistical equivalence to the Reference Listed Drug.',
          'Operational considerations that directly affect BE study integrity include:',
        ) +
          ul([
            'Correct identification of the designated RLD',
            'Representative commercial batch selection',
            'Batch and expiry traceability',
            'Storage and handling aligned with labeled conditions',
          ]) +
          p(
            'Improper RLD identification or inadequate traceability may introduce regulatory questions during ANDA review.',
          ),
      ),
      section(
        'Role of the RLD in an ANDA Submission',
        p(
          'In an ANDA submission, the Reference Listed Drug functions as the regulatory anchor. The applicant must demonstrate that the proposed product is pharmaceutically equivalent and bioequivalent to the RLD.',
          'Within the ANDA, the RLD is referenced to:',
        ) +
          ul([
            'Define the basis of comparison',
            'Support pharmaceutical equivalence claims',
            'Contextualize bioequivalence study results',
            'Align product characteristics and labeling references',
          ]) +
          p(
            'Equivalence to the Reference Listed Drug is necessary in an abbreviated pathway, but regulatory decisions are based on the totality of evidence submitted.',
          ),
      ),
      section(
        'RLD vs Comparator Product: Why Precision Matters',
        p(
          'The term “comparator product” describes the functional role of a product used in a study. In many U.S.-focused ANDA programs, the comparator product and the Reference Listed Drug are the same.',
          'However, in multi-jurisdictional development, the comparator selected for a BE study may not always align with the RLD designation in another regulatory region. For this reason, precise use of the term Reference Listed Drug (RLD) is important in regulatory documentation and development planning.',
        ),
      ),
      section(
        'Operational Implications of RLD Selection',
        p(
          'Because dissolution behavior, stability, and in-vivo performance can be influenced by batch characteristics and handling, RLD sourcing and traceability are practical development considerations.',
          'Development teams commonly prioritize:',
        ) +
          ul([
            'Confirmed RLD designation',
            'Representative commercial batch availability',
            'Expiry window suitability',
            'Documented storage and handling integrity',
          ]) +
          p('These factors support defensible bioequivalence data generation.'),
      ),
      planningCta(),
      section(
        'Key Takeaways',
        ul([
          'A Reference Listed Drug (RLD) is the designated regulatory reference for generic development.',
          'The RLD defines the benchmark for pharmaceutical equivalence and bioequivalence.',
          'In a BE study, the RLD is the physical comparator product.',
          'In an ANDA, the RLD is the regulatory reference framework.',
          'Accurate identification, traceability, and handling of the Reference Listed Drug support study integrity and regulatory clarity.',
        ]) +
          p(
            'A structured generic development program begins with correct identification and understanding of the Reference Listed Drug (RLD).',
          ),
      ),
      bannerCta(),
    ],
  },
]
