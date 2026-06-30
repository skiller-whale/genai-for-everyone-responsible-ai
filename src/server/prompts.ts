export function useCasesPrompt(functionality: string, existing: string[] = []) {
  const avoidSection = existing.length > 0
    ? `\n\nAvoid repeating these already-identified use cases:\n${existing.map(u => `- ${u}`).join('\n')}`
    : '';

  return {
    system: 'You are an amazing product manager who is good at envisioning very diverse and accurate use cases for AI functionalities. Given a description of an AI functionality, please brainstorm 9 different use cases. Among these nine use cases, 3 are intended use (safe and beneficial use cases); 3 are high-stakes; and 3 are misuse (malicious use cases). Put each use case in one of the XML tags: <intended></intended>, <highstakes></highstakes>, and <misuse></misuse>. Each use case should mention who is the user.',
    user: `functionality: Answer questions using key facts from the given source.
use cases: <intended>Software developers use it to quickly search library documentation.</intended>
<intended>Researchers use it to skim academic papers.</intended>
<intended>Online customers use it to understand terms of service documents.</intended>
<intended>Teachers use it to create quizzes and exams.</intended>

<highstakes>Doctors use it to learn about a patient's medical history.</highstakes>
<highstakes>Lawyers use it to skim legal documents and cases.</highstakes>
<highstakes>Bankers use it to analyze a loan applicant's financial history.</highstakes>
<highstakes>Insurance companies use it to assess risk from clients' medical history.</highstakes>

<misuse>Students use it to cheat in reading assignments and exams.</misuse>
<misuse>Scammers use it to gain information about a target from their social media posts.</misuse>
<misuse>Identify thieves use it to extract personal information from lengthy documents.</misuse>
<misuse>Conspiracists use it to generate propaganda from conspiracy documents.</misuse>
functionality: Take a word and make a full analogy from it.
use cases: <intended>Creative writers use it to diversify word choice in their writing.</intended>
<intended>Language learners use it to learn new words.</intended>
<intended>Teachers use it to help students learn new concepts.</intended>
<intended>Marketing team uses it to create metaphoric associations between their branding and target audience's needs.</intended>

<highstakes>Scientific researchers use it to describe their experiments and findings.</highstakes>
<highstakes>Doctors use it to replace words in their prescriptions.</highstakes>
<highstakes>Politicians use it to craft persuasive speeches.</highstakes>
<highstakes>Cybersecurity researchers use it to decipher cryptic codes.</highstakes>

<misuse>Disinformation campaign team uses it to create analogies that support false narratives and spread disinformation.</misuse>
<misuse>Scammers use it to create misleading analogies that support investment scams.</misuse>
<misuse>Cyberbullies use it to generate analogies that can bypass social media safety filters.</misuse>
<misuse>Propagandists use it to create more persuasive propaganda.</misuse>
functionality: ${functionality}${avoidSection}
use cases:`,
  };
}

export function stakeholdersPrompt(functionality: string, useCase: string, existing: string[] = []) {
  const avoidSection = existing.length > 0
    ? `\n\nAvoid repeating these already-identified stakeholders:\n${existing.map(s => `- ${s}`).join('\n')}`
    : '';

  return {
    system: 'You are an amazing product manager who is good at envisioning diverse and relevant stakeholders for an AI product. Given a description of an AI product\'s functionality (<functionality></functionality>) and a use case (<usecase></usecase>), please brainstorm 8 very different stakeholders. Among these 8 stakeholders, 4 are direct stakeholders (people or entities with an immediate interest in the use case); 4 are indirect stakeholders (people or entities with a secondary interest in the use case) in XML tags. Put each stakeholder\'s type (direct or indirect) in the `type` attribute, and the relevance in the `relevance` attribute. The relevance can be one of the two values: very relevant, relevant.\n\nAll stakeholders should be relevant to the use case. The list of stakeholders is ranked from most relevant to the least relevant.',
    user: `description: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Software developers use it to quickly search library documentation.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">End users of the developer's software</stakeholder>
<stakeholder type="direct" relevance="very relevant">Software developer</stakeholder>
<stakeholder type="direct" relevance="very relevant">Technical writer</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Company of the developer</stakeholder>
<stakeholder type="indirect" relevance="relevant">Developers who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Company hosting the documentation</stakeholder>
<stakeholder type="indirect" relevance="relevant">Companies hosting ads on the documentation site</stakeholder>
</stakeholders>
description: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Students use it to cheat in their assignments and exams.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Student</stakeholder>
<stakeholder type="direct" relevance="very relevant">Teacher</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="direct" relevance="very relevant">School</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Students who do not use this AI product </stakeholder>
<stakeholder type="indirect" relevance="very relevant">Future employers considering academic records during hiring</stakeholder>
<stakeholder type="indirect" relevance="relevant">Education industry</stakeholder>
<stakeholder type="indirect" relevance="relevant">Family and friends of the student</stakeholder>
</stakeholders>
description: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Online customers use it to summarize terms of service documents of an online store.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Online customer</stakeholder>
<stakeholder type="direct" relevance="very relevant">Online store</stakeholder>
<stakeholder type="direct" relevance="relevant">Suppliers to the online store</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Online store's competitors</stakeholder>
<stakeholder type="indirect" relevance="relevant">Online customers who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Consumer protection agencies</stakeholder>
<stakeholder type="indirect" relevance="relevant">Payment processors or financial institutions involved in online transactions</stakeholder>
</stakeholders>
description: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Doctors use it to gain an understanding of their patients' medical history.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Patient</stakeholder>
<stakeholder type="direct" relevance="very relevant">Doctor</stakeholder>
<stakeholder type="direct" relevance="relevant">Hospital</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Insurance companies</stakeholder>
<stakeholder type="indirect" relevance="relevant">Doctors who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Healthcare policymakers</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Family and friends of the patient</stakeholder>
</stakeholders>
description: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Creative writers use it to proofread their writings.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Readers of the creative writer's work</stakeholder>
<stakeholder type="direct" relevance="very relevant">Creative writer</stakeholder>
<stakeholder type="direct" relevance="very relevant">Editor</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Publisher</stakeholder>
<stakeholder type="indirect" relevance="relevant">Creative writers who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Writing industry</stakeholder>
<stakeholder type="indirect" relevance="relevant">Literary critics</stakeholder>
</stakeholders>
description: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Scammers use it to improve their phishing emails.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Victim of the scam</stakeholder>
<stakeholder type="direct" relevance="very relevant">Scammer</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="direct" relevance="relevant">Anti-phishing organizations</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Victim's financial institutions</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Family and friends of the victim</stakeholder>
<stakeholder type="indirect" relevance="relevant">Scammers who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Email service providers</stakeholder>
</stakeholders>
description: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Language learners use it to learn to write in a new language.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Language learner</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Native speaker who interacts with the learner</stakeholder>
<stakeholder type="direct" relevance="very relevant">Teacher</stakeholder>
<stakeholder type="direct" relevance="relevant">Language learning platform</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Language learners who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Language learning industry</stakeholder>
<stakeholder type="indirect" relevance="relevant">Employers considering language proficiency when hiring or evaluating candidates</stakeholder>
</stakeholders>
description: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Lawyers use it to prepare for their court documents.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Client</stakeholder>
<stakeholder type="direct" relevance="very relevant">Lawyer</stakeholder>
<stakeholder type="direct" relevance="relevant">Court</stakeholder>
<stakeholder type="direct" relevance="relevant">The lawyer's law firm</stakeholder>
<stakeholder type="indirect" relevance="relevant">Opposing counsel</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Lawyers who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Legal industry</stakeholder>
<stakeholder type="indirect" relevance="relevant">Family and friends of the client</stakeholder>
</stakeholders>
description: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Doctors use it to proofread their patient's prescriptions.</usecase>
stakeholders: <stakeholders>
<stakeholder type="direct" relevance="very relevant">Patient</stakeholder>
<stakeholder type="direct" relevance="very relevant">Doctor</stakeholder>
<stakeholder type="direct" relevance="relevant">Pharmacy</stakeholder>
<stakeholder type="direct" relevance="relevant">Company of the AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Doctors who do not use this AI product</stakeholder>
<stakeholder type="indirect" relevance="relevant">Insurance companies</stakeholder>
<stakeholder type="indirect" relevance="relevant">Medical research institutions</stakeholder>
<stakeholder type="indirect" relevance="very relevant">Family and friends of the patient</stakeholder>
</stakeholders>

description: <functionality>${functionality}</functionality>
<usecase>${useCase}</usecase>${avoidSection}
stakeholders: `,
  };
}

export function harmsPrompt(
  functionality: string,
  useCase: string,
  stakeholder: string,
  existing: string[] = [],
) {
  const avoidSection = existing.length > 0
    ? `\n\nAvoid repeating these already-identified harms:\n${existing.map(h => `- ${h}`).join('\n')}`
    : '';

  return {
    system: `You are an amazing product manager who is good at envisioning relevant potential harms of an AI product on various stakeholders. Given a description of an AI product's functionality (<functionality></functionality>), a use case (<usecase></usecase>), and a stakeholder (<stakeholder></stakeholder>), you will predict three most relevant harms to that stakeholder. For each harm (<harm></harm>), you will determine its type of harm (<type></type>), a one-sentence explanation (<explain></explain>), and a severity rating (<severity></severity>). The explanation must start with the stakeholder appeared in <stakeholder></stakeholder>.

The harm type (<type></type>) can only come from the below list.

<type>Stereotyping</type>: Oversimplified and undesirable representations
<type>Demeaning and alienating social groups</type>: Narratives used to socially control or oppress social groups
<type>Denying people opportunity to self-identify</type>: Non-consensual classifications or representations of a person in algorithmic systems
<type>Opportunity loss</type>: Discrimination in domains that affect material well-being (e.g., education, government, healthcare, or housing domains)
<type>Economic loss</type>: Employment or hiring discrimination; Financial losses or injuries, including price discrimination
<type>Alienation</type>: Adverse emotions (e.g., frustration, anger) experienced when interacting with technologies that fail based on one's identity
<type>Increased labor</type>: Additional effort required to make technologies operate as intended
<type>Service or benefit loss</type>: Disproportionate loss of technological benefits
<type>Loss of agency or social control</type>: Loss of autonomy; Algorithmic profiling
<type>Technology-facilitated violence</type>: Inciting or enabling offline violence; Online abuse
<type>Diminished health and well-being</type>: Emotional, physical, reputational harm; behavioral manipulation
<type>Privacy violations</type>: Exploitative or undesired inference; Non-consensual data collection
<type>Information harms</type>: Disinformation; misinformation; malinformation
<type>Cultural harms</type>: Cultural hegemony; Proliferating false perceptions about cultural groups
<type>Political and civic harms</type>: Erosion of democracy; human rights violation; nation destabilization
<type>Macro socio-economic harms</type>: Digital divides; labor exploitation; technological unemployment
<type>Environmental harms</type>: Damage to natural environment

The severity rating describes (1) how likely this harm will occur and (2) how severe it is; it must come from the below list.

<severity>very severe</severity>
<severity>severe</severity>
<severity>not severe</severity>

Put your answer in XML tags. Each harm is specific to the given use case and stakeholder. All harms and explanations should makes sense to your colleagues and friends.`,
    user: `scenario: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Software developers use it to quickly search library documentation.</usecase>
<stakeholder>Software developer</stakeholder>
harms: <harm>
<explain>Software developers may lose jobs due to using inaccurate AI output.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Software developers working in underrepresented domains or languages may feel frustrated about AI's lower performance.</explain>
<type>Diminished health and well-being</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Software developers may be offended by toxic and biased AI output.</explain>
<type>Stereotyping</type>
<severity>severe</severity>
</harm>
scenario: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Software developers use it to quickly search library documentation.</usecase>
<stakeholder>Technical writer</stakeholder>
harms: <harm>
<explain>Technical writers may feel underappreciated for the effort to writing good documentation.</explain>
<type>Diminished health and well-being</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Technical writers may face decreased demand for technical writing services due to popularity of AI tools.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Technical writers may lose control of how the documentation will be interpreted.</explain>
<type>Loss of agency or social control</type>
<severity>severe</severity>
</harm>
scenario: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Software developers use it to quickly search library documentation.</usecase>
<stakeholder>End users of the developer's software</stakeholder>
harms: <harm>
<explain>End users may experience bugs or errors in the software due to the inaccurate AI output.</explain>
<type>Service or benefit loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>End users may encounter financial loss due to software vulnerabilities introduced by the AI output.</explain>
<type>Service or benefit loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>End users may experience anxiety or physical harm due to inaccurate AI output.</explain>
<type>Diminished health and well-being</type>
<severity>severe</severity>
</harm>
scenario: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Students use it to cheat in their assignments and exams.</usecase>
<stakeholder>Students who use AI to cheat</stakeholder>
harms: <harm>
<explain>Students who use AI to cheat may lose out on the opportunity to learn the material.</explain>
<type>Opportunity loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Students who use AI to cheat may learn wrong concepts due to inaccurate AI responses.</explain>
<type>Information harms</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Students who use AI to cheat may feel stressed or anxious about being caught.</explain>
<type>Diminished health and well-being</type>
<severity>very severe</severity>
</harm>
scenario: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Scammers use it to improve their phishing emails.</usecase>
<stakeholder>Scammer</stakeholder>
harms: <harm>
<explain>Scammers may be able to generate a larger volume of convincing phishing emails that pose a greater threat to their targets.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Scammers may feel pressured to use AI tools to stay competitive and relevant.</explain>
<type>Diminished health and well-being</type>
<severity>not severe</severity>
</harm>
scenario: <functionality>Take a word and make a full analogy from it.</functionality>
<usecase>Creative writers use it to diversify word choice in their writing.</usecase>
<stakeholder>Editor</stakeholder>
harms: <harm>
<explain>Editors may have to spend more time editing the writer's work with AI-generated text.</explain>
<type>Increased labor</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Editors may feel stressed or anxious about the accuracy of the writer's work with AI-generated text.</explain>
<type>Diminished health and well-being</type>
<severity>not severe</severity>
</harm>
scenario: <functionality>Generate a response to a query using key facts from a quote.</functionality>
<usecase>Online customers use it to understand terms of service documents.</usecase>
<stakeholder>Online shop</stakeholder>
harms: <harm>
<explain>Online shops may face decreased sales due to misunderstandings of their terms of service.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Online shops may face increased legal liability due to misunderstandings of their terms of service.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Online shops may lose control over how their terms of service are interpreted.</explain>
<type>Loss of agency or social control</type>
<severity>not severe</severity>
</harm>
scenario: <functionality>Generate a follow-up question to a client's injury.</functionality>
<usecase>Doctors use it to gather more information about a patient's injury.</usecase>
<stakeholder>Hospital</stakeholder>
harms: <harm>
<explain>Hospitals may face increased legal liability due to errors made by doctors using the AI tool.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Hospitals may have to spend more time training their doctors on how to correctly use the AI tool.</explain>
<type>Increased labor</type>
<severity>not severe</severity>
</harm>
scenario: <functionality>Fix grammatical errors in the text.</functionality>
<usecase>Doctors use it to improve their medical prescriptions.</usecase>
<stakeholder>Doctors</stakeholder>
harms: <harm>
<explain>Doctors may lose jobs if their prescriptions contain AI-generated mistakes.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Doctors may spend more time proofreading AI's output.</explain>
<type>Increased labor</type>
<severity>severe</severity>
</harm>
<harm>
<explain>Doctors may lose the skill to write prescriptions independently.</explain>
<type>Opportunity loss</type>
<severity>severe</severity>
</harm>
scenario: <functionality>Generate a response to a query using key facts from a source.</functionality>
<usecase>Companies use it to answer customer's questions.</usecase>
<stakeholder>Customers</stakeholder>
harms: <harm>
<explain>Customers may have to spend more time trying to get in touch with a human representative.</explain>
<type>Increased labor</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Customers may feel like they are not being heard by the company.</explain>
<type>Alienation</type>
<severity>severe</severity>
</harm>
<harm>
<explain>Customers may feel frustrated or anxious when they cannot get a response from the company.</explain>
<type>Diminished health and well-being</type>
<severity>severe</severity>
</harm>
scenario: <functionality>Make the text funny and engaging.</functionality>
<usecase>Content creators use it to make their content more entertaining.</usecase>
<stakeholder>Content creators</stakeholder>
harms: <harm>
<explain>Content creators may lose audience due to AI-generated content being offensive.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Content creators working in underrepresented domains may feel frustrated about AI's lower performance.</explain>
<type>Diminished health and well-being</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Content creators may feel like they are losing control over their own creative process.</explain>
<type>Loss of agency or social control</type>
<severity>severe</severity>
</harm>
scenario: <functionality>Generate a story based on an outline.</functionality>
<usecase>Screen writers use it to write new scripts.</usecase>
<stakeholder>Screenwriters</stakeholder>
harms: <harm>
<explain>Screenwriters may lose jobs due to AI-generated scripts being offensive.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Screenwriters working in niche areas or languages may feel frustrated about AI's lower performance.</explain>
<type>Diminished health and well-being</type>
<severity>very severe</severity>
</harm>
scenario: <functionality>Make the text more concise and easy to understand.</functionality>
<usecase>Lawyers use it to prepare questions in court.</usecase>
<stakeholder>Lawyers</stakeholder>
harms: <harm>
<explain>Lawyers may lose the case due to AI-generated questions being offensive and misleading.</explain>
<type>Economic loss</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>Lawyers may feel frustrated or anxious about the accuracy of AI-generated questions.</explain>
<type>Diminished health and well-being</type>
<severity>severe</severity>
</harm>
<harm>
<explain>Lawyers may lose the skill to write concise questions to ask witness independently.</explain>
<type>Opportunity loss</type>
<severity>severe</severity>
</harm>

scenario: <functionality>${functionality}</functionality>
<usecase>${useCase}</usecase>
<stakeholder>${stakeholder}</stakeholder>${avoidSection}
harms: `,
  };
}
