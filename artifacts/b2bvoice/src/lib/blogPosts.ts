// Static blog content — no database/admin panel involved.
// To publish a real article: fill in a slot below (or add a new object) with
// the HTML you have and drop the cover image file into
// b2bvoice/public/blog/<slug>.jpg (or update coverImage to match).

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string; // ISO date, e.g. "2026-03-07"
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  /** Raw HTML — rendered with dangerouslySetInnerHTML on the post page. */
  content: string;
}

// The same article, published 3 times (distinct slugs) per request — swap
// each slot's content/metadata independently once real distinct posts arrive.
const whatIsB2bVoiceContent = `
      <section class="quick-answer" aria-label="Quick answer">
        <strong class="label">Quick answer</strong>
        <p>
          <strong>B2B Voice is a custom AI voice-agent implementation company for business phone calls.</strong>
          Instead of handing a business a generic agent builder and asking its team to configure the system alone,
          B2B Voice learns how the business works, then designs and builds the phone assistant around its services,
          customer questions, call flow, scheduling rules, handoff logic, and connected business tools.
          The business provides the knowledge and requirements; the B2B Voice team handles the technical implementation.
        </p>
      </section>

      <h2>What is B2B Voice?</h2>

      <p>
        B2B Voice is a company focused on <strong>AI Voice Agents, AI Phone Agents, AI Receptionists,
        and Business Phone Automation</strong>. Its systems are designed to handle real phone conversations
        for businesses: answering incoming calls, understanding what the caller needs, collecting information,
        helping with appointment or lead-intake workflows, routing requests, and connecting call outcomes
        to business systems such as CRM, calendars, spreadsheets, and communication tools.
      </p>

      <p>
        But the clearest way to understand B2B Voice is not as "another place to create an AI bot."
        The company's public positioning is based on a custom-build model: every assistant is prepared around
        the specific business, its customers, its services, and the way its phone calls should actually be handled.
      </p>

      <div class="thesis">
        Your job is to explain how your business works. Our job is to turn that into the system.
      </div>

      <h2>The main difference: a platform gives you tools. B2B Voice gives you the implementation.</h2>

      <p>
        Voice AI has become much easier to access. Many modern voice-AI products provide dashboards,
        visual workflow builders, APIs, prompts, model settings, integrations, and telephony controls that let
        businesses or developers create and configure an agent themselves.
      </p>

      <p>
        Those products can be powerful. The problem is that <strong>access to a builder is not the same thing as a finished business system</strong>.
        Someone still has to understand the company, decide what the agent should and should not do, write the conversation logic,
        connect the right tools, define handoff conditions, test edge cases, and make the complete workflow usable in a real operation.
      </p>

      <p>
        B2B Voice takes a more hands-on approach. You tell the team what kind of business you run, what customers usually call about,
        what information needs to be collected, how appointments or requests should be handled, when a human should take over,
        which languages matter, and which systems are already part of your operation. The implementation is then built around those requirements.
      </p>

      <div class="table-wrap">
        <table aria-label="Self-service voice AI platform compared with B2B Voice">
          <thead>
            <tr>
              <th>Question</th>
              <th>Typical self-service voice AI builder</th>
              <th>B2B Voice approach</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Where do you start?</td>
              <td>Inside a dashboard, builder, API, or workflow editor.</td>
              <td>With the business: services, callers, goals, rules, systems, and call flow.</td>
            </tr>
            <tr>
              <td>Who designs the call behavior?</td>
              <td>Your team usually configures prompts, flows, tools, and logic.</td>
              <td>B2B Voice designs the implementation with your business input.</td>
            </tr>
            <tr>
              <td>Who connects the workflow?</td>
              <td>Your team or developer connects the required systems.</td>
              <td>The required integrations are planned as part of the custom implementation.</td>
            </tr>
            <tr>
              <td>Who thinks through handoff and edge cases?</td>
              <td>Usually the customer, developer, or implementation partner.</td>
              <td>Handoff rules and business-specific scenarios are part of the design process.</td>
            </tr>
            <tr>
              <td>What is the target output?</td>
              <td>A configured agent inside a platform.</td>
              <td>A phone assistant designed around the actual business workflow.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="note">
        This comparison describes a common self-service builder model, not the entire voice-AI market.
        Different providers may combine software, implementation, consulting, or managed services in different ways.
      </p>

      <h2>So what does B2B Voice actually do?</h2>

      <p>
        A B2B Voice deployment can combine conversation with business actions. The exact setup depends on the company,
        but the current B2B Voice service describes capabilities including automated call handling, appointment scheduling,
        CRM integration, multilingual communication, lead intake, call summaries, and business-specific routing or workflow logic.
      </p>

      <h3>1. Answer incoming business calls</h3>
      <p>
        The AI assistant can answer incoming calls when customers contact the business, including situations where staff are busy
        or the business wants broader phone coverage. B2B Voice currently positions its phone assistants as available for 24/7 call handling.
      </p>

      <h3>2. Understand why the customer is calling</h3>
      <p>
        The assistant can ask questions and identify the caller's need instead of forcing every caller through the same static menu.
        A service inquiry, appointment request, lead, support question, urgent request, or routing need can follow a different path
        when the deployment is designed to do so.
      </p>

      <h3>3. Collect useful information during the conversation</h3>
      <p>
        Depending on the workflow, the system can capture details such as the caller's name, phone number, service request,
        preferred time, urgency, or other information the business needs before the next step.
      </p>

      <h3>4. Handle appointment and lead-intake workflows</h3>
      <p>
        B2B Voice publicly lists appointment scheduling and lead intake among its current use cases. That can include gathering
        the information needed for a booking request, organizing the request, and connecting it to the relevant calendar or workflow
        when the business setup supports it.
      </p>

      <h3>5. Route the request or hand the conversation to a human</h3>
      <p>
        Not every call should end with the AI. A good phone workflow also needs rules for when a person, department, or other process
        should take over. B2B Voice's setup process explicitly asks when the assistant should answer directly and when the conversation
        should be handed to a human. Its legal notice also states that callers interacting with a B2B Voice-powered assistant may request
        a human representative.
      </p>

      <h3>6. Connect phone conversations to business systems</h3>
      <p>
        A phone call becomes more valuable when the result does not disappear after the caller hangs up. Depending on the implementation,
        B2B Voice can connect call information to systems such as CRM, calendars, spreadsheets, and communication workflows.
        The current website lists examples including HubSpot, Zoho CRM, Google Calendar, Calendly, Gmail, Microsoft Teams,
        Google Sheets, Excel, and WhatsApp.
      </p>

      <h3>7. Send call summaries and lead details</h3>
      <p>
        After a conversation, the system can produce a structured summary of who called, what they needed, their intent,
        and the recommended next step. This makes the call useful to the team even if nobody from the business was available
        during the original conversation.
      </p>

      <h3>8. Support multilingual conversations</h3>
      <p>
        B2B Voice also offers multilingual voice-assistant setups. The language mix is part of the custom configuration,
        so the relevant question is not simply "how many languages exist?" but which languages the business actually needs
        for its customers and call flows.
      </p>

      <h2>What does a business need to do?</h2>

      <p>
        "Done for you" does not mean the business provides no input. The company still knows its customers, rules, services,
        and edge cases better than anyone else. B2B Voice needs that business knowledge in order to build the right system.
      </p>

      <p>
        The current B2B Voice setup process asks businesses to provide or clarify things such as:
      </p>

      <ul>
        <li>what kind of business they operate;</li>
        <li>which services they offer;</li>
        <li>which questions customers ask most often;</li>
        <li>how appointments or calls should be scheduled;</li>
        <li>which information must be collected;</li>
        <li>what the assistant is allowed to answer directly;</li>
        <li>when a human should take over;</li>
        <li>what tone the business wants to use;</li>
        <li>which languages are needed; and</li>
        <li>which CRM, calendar, booking, or communication tools are already in use.</li>
      </ul>

      <p>
        In other words, <strong>the business provides the operational truth; the B2B Voice team turns that truth into the phone system.</strong>
      </p>

      <h2>How does the B2B Voice process work?</h2>

      <ol class="steps">
        <li>
          <strong>Understand the business.</strong>
          The starting point is not a blank prompt. It is the company's services, customers, phone traffic, rules, and desired outcomes.
        </li>
        <li>
          <strong>Define the call flow.</strong>
          The team maps what the assistant should ask, answer, collect, route, schedule, summarize, or escalate.
        </li>
        <li>
          <strong>Build the agent around those requirements.</strong>
          Voice, tone, business knowledge, conversation behavior, and workflow logic are configured for the specific use case.
        </li>
        <li>
          <strong>Connect the required business systems.</strong>
          CRM, calendars, spreadsheets, booking tools, and communication workflows are connected where the implementation requires them.
        </li>
        <li>
          <strong>Test the business-specific scenarios.</strong>
          The system is tested around the way that business expects real calls to behave, rather than treating the project as a generic demo.
        </li>
        <li>
          <strong>Deploy a working phone assistant.</strong>
          The objective is not to leave the customer with a builder to finish. The objective is to deliver the implemented system the business asked for.
        </li>
      </ol>

      <h2>Is B2B Voice only for small businesses?</h2>

      <p>
        No single company size defines the model. A focused deployment might handle one location and a small number of call types.
        A more complex deployment might need multiple workflows, departments, integrations, languages, or escalation rules.
      </p>

      <p>
        The important point is that the implementation is designed around the <strong>complexity of the workflow</strong>,
        not around forcing every customer into the same pre-built assistant.
      </p>

      <h2>What B2B Voice is not</h2>

      <ul>
        <li><strong>It is not a one-size-fits-all phone bot.</strong> The public service model is based on custom configuration for each business.</li>
        <li><strong>It is not just software access.</strong> The value proposition includes the design and implementation work around the software.</li>
        <li><strong>It is not a promise that every call should stay with AI.</strong> Human handoff rules are part of a responsible call flow.</li>
        <li><strong>It is not a static IVR menu.</strong> The system is designed for conversational call handling and workflow actions.</li>
        <li><strong>It is not "magic AI."</strong> The quality of the system still depends on clear business information, rules, integrations, testing, and sensible boundaries.</li>
      </ul>

      <h2>Why choose a managed custom-build model?</h2>

      <p>
        The voice-AI technology itself is only one layer of the problem. A production phone system also needs business logic,
        conversation design, knowledge, telephony, integrations, action rules, escalation, testing, and operational ownership.
      </p>

      <p>
        A company can absolutely choose to build those pieces internally using a developer platform or no-code builder.
        For teams that want that control and have the right technical resources, that can make sense.
      </p>

      <p>
        B2B Voice is designed for a different preference:
        <strong>a business should be able to explain the result it needs without first becoming a voice-AI implementation team.</strong>
      </p>

      <p>
        That is the core distinction. The customer is not buying homework. The customer is buying the implementation.
      </p>

      <div class="one-sentence">
        <div class="label">B2B Voice in one sentence</div>
        <p>B2B Voice builds custom AI voice agents that turn business phone calls into conversations, actions, and connected workflows — without requiring the customer to build the agent alone.</p>
      </div>

      <h2>Frequently asked questions</h2>

      <section class="faq">
        <div class="faq-item">
          <h3>Is B2B Voice a self-service AI agent builder?</h3>
          <p>
            B2B Voice is positioned primarily around custom implementation rather than simply giving the customer a generic builder.
            The team learns the business requirements and builds the assistant around the company's call flow, services, questions, and systems.
          </p>
        </div>

        <div class="faq-item">
          <h3>Do I need to build the AI voice agent myself?</h3>
          <p>
            You need to explain how your business works and approve the important rules. You do not need to design the complete technical system by yourself.
            B2B Voice handles the implementation around those requirements.
          </p>
        </div>

        <div class="faq-item">
          <h3>Can B2B Voice answer calls 24/7?</h3>
          <p>
            Yes. B2B Voice currently positions its AI phone assistants for 24/7 call coverage, with the exact call behavior configured around the business.
          </p>
        </div>

        <div class="faq-item">
          <h3>Can B2B Voice book appointments?</h3>
          <p>
            Appointment scheduling is one of the current capabilities listed by B2B Voice. The exact booking flow depends on the business rules
            and the calendar or scheduling tools used in the implementation.
          </p>
        </div>

        <div class="faq-item">
          <h3>Can B2B Voice connect to a CRM or calendar?</h3>
          <p>
            Yes. B2B Voice currently lists CRM and calendar integration as part of its service, with specific tools and workflows selected according
            to the customer's setup.
          </p>
        </div>

        <div class="faq-item">
          <h3>Can a caller be transferred to a human?</h3>
          <p>
            Human handoff can be built into the call flow. B2B Voice's setup process specifically includes deciding when the assistant should answer
            and when a conversation should be handed to a person.
          </p>
        </div>

        <div class="faq-item">
          <h3>Can I see how B2B Voice would work for my company before I start?</h3>
          <p>
            B2B Voice currently offers a free custom demo designed around the prospective customer's business, services, and call flow.
          </p>
        </div>
      </section>

      <section class="cta">
        <h2>See what B2B Voice would look like for your business.</h2>
        <p>
          Tell us how your company works, what your customers call about, and what you want the system to accomplish.
          B2B Voice can use that information to prepare a custom demo around your real call flow.
        </p>
        <a class="button" href="https://b2b-voice.com/">Request a Free Custom Demo →</a>
      </section>

      <div class="next">
        <strong>Next in the B2B Voice knowledge series:</strong>
        <em>What Is an AI Voice Agent? A Complete Guide to Business Phone Automation.</em>
      </div>
    `;

const whatIsB2bVoiceMeta = {
  title: "What Is B2B Voice and What Does It Do?",
  author: "B2B Voice",
  date: "2026-08-12",
  category: "AI",
  tags: ["AI Voice Agent", "AI Receptionist", "Business Phone Automation", "Conversational AI"],
  excerpt: "B2B Voice designs and builds custom AI voice agents and AI receptionists for businesses. The important difference is not simply the technology — it is who turns that technology into a working business system.",
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "what-is-b2b-voice",
    ...whatIsB2bVoiceMeta,
    coverImage: "/blog/what-is-b2b-voice-cover.jpg",
    content: whatIsB2bVoiceContent,
  },
  {
    id: 2,
    slug: "what-is-b2b-voice-2",
    ...whatIsB2bVoiceMeta,
    coverImage: "/blog/what-is-b2b-voice-cover.jpg",
    content: whatIsB2bVoiceContent,
  },
  {
    id: 3,
    slug: "what-is-b2b-voice-3",
    ...whatIsB2bVoiceMeta,
    coverImage: "/blog/what-is-b2b-voice-cover.jpg",
    content: whatIsB2bVoiceContent,
  },
];

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(blogPosts.map((p) => p.category))).sort();
}
