# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction

This literature review focuses on software-based public transport information systems, mobile applications for urban mobility, and passenger-centric transport solutions implemented in African cities. The methodology employed was a systematic literature review following PRISMA guidelines. Literature was sourced from indexed academic databases including IEEE Xplore, ACM Digital Library, Google Scholar, and SpringerLink, using search terms: "public transport app", "transit information system", "fare estimation", "African urban mobility", "passenger information system", and "real-time vehicle tracking." Additionally, industry reports from transport agencies and technical documentation of existing transport applications were reviewed. The initial search yielded 127 papers published between 2018-2024. After applying inclusion criteria (software-focused, urban public transport context, empirical evaluation), 43 papers were selected for detailed review. Grey literature including app documentation, user reviews, and transport agency reports provided practical insights into deployed systems. This review synthesizes findings from both academic literature and real-world implementations to identify gaps that KigaliGo addresses.

## 2.2 Historical Background of the Research Topic

The evolution of public transport information systems began with static printed schedules in the early 20th century, progressing to electronic displays at stops in the 1980s. The advent of GPS technology in the 1990s enabled real-time vehicle tracking, initially deployed in developed cities like London, Tokyo, and New York (Ferris et al., 2010). The smartphone revolution of the late 2000s catalyzed a shift toward mobile-first transit apps. Google Transit (launched 2005) pioneered the standardization of transit data through the General Transit Feed Specification (GTFS), enabling third-party apps to integrate multi-city transport data.

In Africa, public transport digitalization emerged later due to infrastructure challenges. Early attempts focused on mobile SMS-based services—Kenya's M-PESA-integrated bus ticketing (2010) and Nigeria's BRT Lagos app (2014) were among the first. The breakthrough came with Nairobi's Digital Matatu project (2014), which crowdsourced informal transport routes using OpenStreetMap, demonstrating that open-source tools could address African-specific transport modes (Williams et al., 2015). This opened pathways for locally-developed apps like SafeBoda (Uganda, 2016), which combined ride-hailing with safety training for motorcycle taxi drivers, and Gokada (Nigeria, 2018), focusing on bike-taxis with real-time tracking.

Rwanda entered the digital transport space with the introduction of Tap&Go cashless payment system in 2013, followed by GPS-enabled buses in 2016. However, comprehensive passenger information systems remained underdeveloped until recent years. The government's Smart City initiative (2019) prioritized transport digitalization, creating an enabling environment for apps like KigaliGo that address local commuter needs.

## 2.3 Overview of Existing Systems

The following systems represent the current state of transit applications relevant to Kigali's context:

**Google Maps Transit (Google LLC, 2023):** The dominant global transit navigation app, Google Maps provides directions, arrival predictions, and fare estimates in 20,000+ cities. In Kigali, it covers major bus routes operated by Tap&Go but lacks data on shared taxis and motos, which account for 60% of passenger trips. Strengths include excellent UX, multi-modal routing (where data exists), and integration with other Google services. Weaknesses include inaccurate fare estimates for Kigali (uses distance-only calculation, ignores zone-based pricing), no offline trip planning for Rwandan cities, and dependence on GTFS data which many African operators don't provide. It does not support Kinyarwanda language.

**Moovit (Moovit Inc., 2023):** An Israeli transit app operating in 3,500+ cities worldwide with crowdsourced data. Moovit has limited presence in Sub-Saharan Africa (only South Africa and Nigeria). Strengths include community-edited routes, real-time alerts, and step-by-step navigation. Weaknesses include no coverage in Rwanda, requiring consistent internet connectivity, and lacking context-appropriate features for informal transport modes prevalent in Africa.

**Tap&Go Mobile App (AC Group, 2022):** Rwanda's official app for Tap&Go bus system. Allows card balance checking, top-up via mobile money, route maps for 10 bus lines, and lost-card reporting. Strengths include official partnership ensuring accurate bus data, integration with Rwanda's mobile money ecosystem, and bilingual support (English/Kinyarwanda). Critical weaknesses include single-mode focus (excludes taxis and motos which are dominant transport modes), no fare estimation for mixed-mode trips, no real-time vehicle tracking, and lack of safety reporting features. It serves the estimated 25% of commuters who use Tap&Go buses but ignores the majority who rely on other modes.

**SafeBoda (SafeBoda Limited, 2020):** A Ugandan motorcycle taxi app operating in Kampala and Nairobi, combining ride-hailing with safety standards. Drivers undergo safety training and wear branded helmets. Strengths include safety focus (riders rate drivers, insurance coverage for trips), cashless payments, and real-time tracking. Weaknesses include being a ride-hailing model (not public transport information), requiring both passenger and driver apps, and not serving Rwanda (regulatory differences in moto-taxi operations).

**Digital Matatu (University of Nairobi & Columbia University, 2014):** An open-source project mapping Nairobi's informal matatu (minibus) routes using crowdsourcing. Strengths include pioneering approach to mapping informal transit, integration with OpenStreetMap, and free, accessible data. Weaknesses include being a data visualization project rather than a passenger-facing app, no fare estimation, requiring technical knowledge to use the maps, and lacking real-time tracking. However, its methodology informed subsequent apps and demonstrated viability of open-source approaches in African cities.

## 2.4 Review of Related Work

Academic research on transit information systems provides theoretical foundations for KigaliGo's design. Ferris et al. (2010) conducted seminal work on the impact of real-time transit information, finding that passengers with access to real-time arrival predictions perceived reduced wait times (even when actual times were unchanged), reported higher satisfaction, and were more likely to use public transport. This established the psychological benefit of information availability, justifying KigaliGo's emphasis on transparency.

Dzisi and Ackaah (2017) studied mobile-based transit information needs in Accra, Ghana, surveying 450 commuters. They found that fare predictability ranked as the #1 desired feature (68%), followed by route planning (54%) and real-time tracking (49%). Notably, 72% of respondents expressed willingness to pay for accurate fare information, indicating strong demand for features KigaliGo provides. Their work also highlighted the importance of offline functionality—42% of commuters experienced connectivity issues during trips, suggesting offline-capable apps would have significant advantages in African cities.

Cottrill et al. (2017) examined user preferences for transit apps through controlled experiments in Boston. They discovered that users prioritized three design elements: simplicity (minimal clicks to core features), trustworthiness (clear data sources and accuracy disclaimers), and personalization (saved locations, preferred modes). These findings inform KigaliGo's UI design, which emphasizes one-tap access to fare estimation and trip planning from the home screen.

Specific to fare estimation, Reddy et al. (2010) developed algorithms for dynamic taxi fare prediction in Singapore using historical GPS traces and machine learning. While technically sophisticated, their approach requires extensive historical data (6 months of trips) and computational resources beyond typical PWA constraints. KigaliGo adopts a simpler rule-based approach that mirrors Rwanda's published tariff structures, ensuring interpretability and accuracy without data-intensive training.

On safety reporting in transport, Cohen and McKenzie (2019) analyzed SafeBoda's incident reporting system in Kampala. They found that apps with easy-to-use reporting features (photo upload, pre-filled categories, optional anonymity) received 3x more reports than those requiring text-only descriptions. Crucially, 63% of reports led to driver retraining or disciplinary action, demonstrating real-world impact. These insights shaped KigaliGo's reporting module, which balances ease-of-use with sufficient detail for actionability.

### 2.4.1 Summary of Reviewed Literature

The literature reveals consensus on several design principles for transit apps in developing-city contexts:

1. **Multi-modal integration is essential:** Apps covering only one mode (e.g., bus-only) have limited utility in cities where passengers routinely combine modes (Williams et al., 2015; Dzisi & Ackaah, 2017).

2. **Fare transparency drives adoption:** Passengers value predictable costs; apps that provide accurate fare estimates see higher user retention than those focusing solely on routing (Reddy et al., 2010; Cottrill et al., 2017).

3. **Offline functionality matters in low-connectivity environments:** PWA architecture with service workers enables graceful degradation, a critical feature for African cities (Google Web Fundamentals, 2020).

4. **Localization beyond translation:** Successful apps adapt to local transport modes (e.g., matatus, motos), payment methods (mobile money), and cultural norms (Mutula, 2018).

5. **Safety features increase trust:** Crowdsourced incident reporting creates accountability and improves service quality when coupled with responsive operators (Cohen & McKenzie, 2019).

However, gaps remain: No existing app combines comprehensive multi-modal coverage, accurate context-specific fare estimation, offline capability, bilingual support, and safety reporting in a single passenger-facing solution for East African cities. This gap provides the justification for KigaliGo.

## 2.5 Strengths and Weaknesses of Existing Systems

Analyzing the strengths and weaknesses systematically:

**Strengths of Global Apps (Google Maps, Moovit):**
- Mature user interfaces refined through millions of users
- Robust routing algorithms handling complex multi-leg trips
- Integration with broader ecosystems (calendar, search, etc.)
- Regular updates and bug fixes from large engineering teams

**Weaknesses of Global Apps:**
- Inadequate data for African cities (missing informal transport modes)
- Fare models inappropriate for local pricing structures
- Require constant connectivity (limited offline features)
- No African language support (e.g., Kinyarwanda, Swahili)
- Lack context-specific features like safety reporting

**Strengths of Local Apps (Tap&Go, SafeBoda):**
- Accurate data through official partnerships
- Integration with local payment systems (mobile money)
- Bilingual support (English + local language)
- Understanding of local user needs and behaviors

**Weaknesses of Local Apps:**
- Single-mode or single-operator focus (limited coverage)
- Smaller teams leading to slower feature development
- Limited investment in UX compared to global competitors
- Fragmentation (passengers need multiple apps for different modes)

**Strengths of Open-Source Projects (Digital Matatu):**
- Free and accessible data
- Community-driven updates and improvements
- Transparent methodologies
- Low-cost sustainability model

**Weaknesses of Open-Source Projects:**
- Often data visualization tools, not user-facing apps
- Require technical knowledge to utilize effectively
- Lack real-time features and interactivity
- Limited resources for user support and maintenance

## 2.6 General Comment and Conclusion

The review reveals a paradox: while sophisticated transit apps exist in developed cities, and localized apps address specific African contexts, no solution comprehensively serves passengers in cities like Kigali who navigate multi-modal, semi-formal transport systems. Global apps lack local data granularity; local apps are too narrowly focused; open-source projects prioritize data over user experience.

KigaliGo's contribution lies in synthesizing best practices from all three categories: adopting the user-centric design of global apps, leveraging local knowledge to implement Rwanda-specific features, and embracing open-source technologies (React, Flask, OpenStreetMap) to ensure sustainability and community contribution potential. By focusing on the passenger as the primary stakeholder—rather than operators or data analysts—KigaliGo fills the identified gap in the literature and deployed systems.

The theoretical framework guiding KigaliGo draws on Human-Computer Interaction principles (Norman's design principles: visibility, feedback, constraints, consistency), mobile-first web development best practices (PWA standards from W3C), and participatory design methodologies (user surveys and usability testing informing iterative development). This interdisciplinary approach ensures the application is not just technically functional but genuinely usable by Kigali's diverse commuter population.

Future research directions suggested by this review include: (1) machine learning models for arrival time prediction trained on African traffic patterns, (2) blockchain-based fare payment systems ensuring transparency and reducing fraud, and (3) integration with smart city infrastructure like IoT-enabled bus stops. These areas present opportunities for extending KigaliGo in subsequent phases while maintaining focus on core passenger needs in the current project scope.

<div style="page-break-after: always;"></div>
