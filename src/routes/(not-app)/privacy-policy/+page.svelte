<script lang="ts">
	import type { HeadingTypes } from '$lib/types/GeneralTypes.js';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />

{#snippet title(title: string, tag?: HeadingTypes, className?: string)}
	<TitleWrapper {tag} {className}>
		{#snippet text()}
			{title}
		{/snippet}
	</TitleWrapper>
{/snippet}

<FadeInWrapper tag="section" class="section-t-spacing container">
	{@render title('Privacy Policy', 'h1', 'mb-0')}
	<small>Last updated on: November 14, 2024</small>
	<p class="mt-2">
		We attach great importance to the transparent handling of personal data. This data protection
		declaration provides information about which personal data we collect, for what purpose and to
		whom we pass it on. In order to ensure a high level of transparency, this data protection
		declaration is regularly reviewed and updated.
	</p>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Which services we use')}
		<ul>
			<li>Supabase</li>
			<li>Vercel</li>
		</ul>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('What data do we collect from you and from whom do we receive this data?')}
		<p>
			First and foremost, we process personal data that you send to us or that we collect when
			operating our website. We may also receive personal data about you from third parties. This
			may include the following categories:
		</p>

		<ul>
			<li>Personal master data (name, address, date of birth, etc.)</li>
			<li>Contact data (mobile phone number, email address, etc.)</li>
			<li>
				Financial data (e.g. account details); Online identifiers (e.g. cookie identifier, IP
				addresses)
			</li>
			<li>
				Location and traffic data; Sound and image recordings; Data that requires special protection
				(e.g. biometric data or information about your health).
			</li>
		</ul>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Under what conditions do we process your data?')}
		<p>
			We treat your data confidentially and in accordance with the purposes set out in this privacy
			policy. We ensure that processing is transparent and proportionate.
		</p>
		<br />
		<p>
			If, in exceptional cases, we are unable to comply with these principles, the data processing
			may still be lawful because there is a justification. The following may be justifications:
		</p>
		<br />
		<p>
			Your consent; the execution of a contract or pre-contractual measures; our legitimate
			interests, provided that your interests do not outweigh them.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('How can you revoke your consent?')}
		<p>
			If you have given us your consent to process your personal data for certain purposes, we will
			process your data within the scope of this consent unless we have another justification.
		</p>
		<br />
		<p>
			You can revoke your consent at any time by sending an email to the address provided in the
			imprint. This does not affect data processing that has already taken place.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('In which cases can we pass your data on to third parties?')}
		{@render title('Principle', 'h3')}
		<p>
			We may be dependent on using the services of third parties or affiliated companies and
			commissioning them to process your data (so-called processors). Categories of recipients are:
		</p>
		<ul>
			<li>Accounting, trust and auditing companies</li>
			<li>Consulting companies (legal advice, taxes, etc.)</li>
			<li>IT service providers (web hosting, support, cloud services, website design, etc.)</li>
			<li>Payment service providers</li>
			<li>Providers of tracking, conversion and advertising services</li>
		</ul>
		<p>
			We ensure that these third parties and our affiliated companies comply with the data
			protection requirements and treat your personal data confidentially.
		</p>
		<br />
		<p>We may also be obliged to disclose your personal data to authorities.</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Transfer abroad?', 'h3')}
		<p>
			In certain circumstances, your personal data may be transferred to companies abroad as part of
			the order processing. These companies are obliged to protect data to the same extent as we
			are. The transfer can take place worldwide.
		</p>
		<p>
			If the level of data protection does not correspond to that of Switzerland, we will carry out
			a prior risk assessment and contractually ensure that the same level of protection is
			guaranteed as in Switzerland (e.g. by means of the new standard contractual clauses of the EU
			Commission or other legally prescribed measures). If our risk assessment is negative, we will
			take additional technical measures to protect your data. You can access the standard
			contractual clauses of the EU Commission at the following link.
			https://commission.europa.eu/publications/standard-contractual-clauses-controllers-and-processors-eueea_de
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('How long do we keep your data?')}
		<p>
			We only keep personal data for as long as is necessary to fulfil the individual purposes for
			which the data was collected. Data that we save when you visit our website is kept for twelve
			months. An exception applies to analysis and tracking data, which can be kept for longer. We
			keep contract data for longer because we are required to do so by law. In particular, we must
			keep business communications, concluded contracts and booking documents for up to 10 years. If
			we no longer need such data from you to carry out the services, the data will be blocked and
			we will only use it for accounting and tax purposes.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('How do we protect your data?')}
		<p>
			We will keep your data safe and take all reasonable measures to protect your data from loss,
			access, misuse or changes.
		</p>
		<br />
		<p>
			Our contractual partners and employees who have access to your data are obliged to comply with
			data protection regulations. In some cases it will be necessary for us to forward your
			inquiries to companies associated with us. Even in these cases, your data will be treated
			confidentially.
		</p>
		<br />
		<p>
			Within our website we use the SSL (Secure Socket Layer) process in conjunction with the
			highest level of encryption supported by your browser.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('What rights do you have?')}
		{@render title('Right to information', 'h3')}
		<p>
			You can request information about the data we have stored about you at any time. We ask you to
			send your request for information together with proof of identity.
		</p>
		<br />
		<p>
			You also have the right to receive your data in a common file format if we process your data
			automatically and if:
		</p>

		<ul>
			<li>You have given your consent for this data to be processed; or</li>
			<li>You have disclosed data in connection with the conclusion or execution of a contract.</li>
		</ul>

		<p>
			We can restrict or refuse to provide information or data if this conflicts with our legal
			obligations, legitimate own or public interests or the interests of a third party.
		</p>
		<br />
		<p>
			The processing of your request is subject to the statutory processing period of 30 days.
			However, we may extend this period due to a high volume of requests, for legal or technical
			reasons or because we require more detailed information from you. You will be informed of the
			extension in good time, at least in text form.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Deletion and correction', 'h3')}
		<p>
			You have the option of requesting the deletion or correction of your data at any time. We can
			reject the request if legal regulations require us to store the data for a longer period or
			without any changes, or if a permit conflicts with your request.
		</p>
		<br />
		<p>
			Please note that the exercise of your rights may conflict with contractual agreements and have
			corresponding effects on the performance of the contract (e.g. early termination of the
			contract or cost consequences).
		</p>
	</article>
</FadeInWrapper>
<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Legal recourse', 'h3')}
		<p>
			If you are affected by the processing of personal data, you have the right to enforce your
			rights in court or to file a report with the responsible supervisory authority. The
			responsible supervisory authority in Switzerland is the Federal Data Protection and
			Information Commissioner: https://www.edoeb.admin.ch
		</p>
	</article>
</FadeInWrapper>
<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Changes to the data protection declaration')}
		<p>
			We can change this data protection declaration at any time. The changes will be published on
			www.questnest.vercel.app; you will not be informed separately.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Individual data processing operations')}
		{@render title('Providing the website and creating log files', 'h3')}
		<p>
			What information do we receive and how do we use it? When you visit www.questnest.vercel.app,
			certain data is automatically stored on our servers or on servers of services and products
			that we purchase and/or have installed for the purposes of system administration, for
			statistical or backup purposes or for tracking purposes. This includes:
		</p>
		<ul>
			<li>the name of your Internet service provider;</li>
			<li>your IP address (where applicable);</li>
			<li>the version of your browser software;</li>
			<li>the operating system of the computer used to access the URL;</li>
			<li>the date and time of access;</li>
			<li>the website from which you visit the URL;</li>
			<li>the search terms you used to find the URL.</li>
			<li>Why are we allowed to process this data?</li>
		</ul>
		<p>
			This data cannot be assigned to a specific person and this data is not merged with other data
			sources. The log files are stored to guarantee the functionality of the website and to ensure
			the security of our information technology systems. This is our legitimate interest.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('How can you prevent data collection?', 'h3')}
		<p>
			The data is only stored for as long as is necessary to achieve the purpose of its collection.
			Accordingly, the data is deleted at the end of each session. The storage of the log files is
			essential for the operation of the website, so you have no option to object to this.
		</p>
	</article>
</FadeInWrapper>

<style lang="postcss">
	ul {
		@apply my-4 list-disc;
	}

	li {
		@apply ml-4 pl-2;
	}
</style>
