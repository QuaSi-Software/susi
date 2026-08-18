import { useState } from 'react';
import { ImpressumModal } from './ImpressumModal';
import fundingDisclaimer from './../../assets/funding_disclaimer.png';
import sizLogo from './../../assets/siz_energieplus_logo_ohne_claim-4x-295.png';
import sizLogo_dark from './../../assets/siz_energieplus_logo_mit_claim_nobg_dark.png';

export const InformationMenu = ({ theme }: { theme: 'dark' | 'light' }) => {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<a href="https://siz-energieplus.de/" target="_blank">
				<img src={theme === 'light' ? sizLogo : sizLogo_dark} style={{ width: '13em', padding: '1em 0em' }} />
			</a>
			<div className="sidebar-subheading">Steinbeis-Innovationszentrum energieplus</div>
			<div>
				<a href="https://siz-energieplus.de/">siz energieplus</a> develops practical solutions for
				climate-neutral buildings, districts, and cities. Its work focuses on renewable energy, integrated
				energy concepts, and sector coupling. By combining scientific expertise with real-world applications,
				the research institute supports the effective transfer of knowledge from research into practice.
			</div>
			<div className="sidebar-subheading">Funding Disclaimer </div>
			<div>
				SUSI is part of the <a href="https://quasi-software.org/">QuaSi II research project</a>, funded by the
				German Federal Ministry for Economic Affairs and Energy (BMWE), formerly known as the Federal Ministry
				for Economic Affairs and Climate Action (BMWK), under grant number 03EN3053. You can visit the{' '}
				<a href="https://www.enargus.de/detail/?id=10331935">EnEff:Stadt: QuaSi_II project page</a> on the
				official funding platform for more details.
			</div>
			<br />
			<button type="button" className="link-button sidebar-subheading" onClick={() => setShowModal(true)}>
				<i className="bi bi-box-arrow-up-right"></i> Impressum
			</button>
			<br />
			<div>
				<img src={fundingDisclaimer} style={{ width: '13em', padding: '1em 0em' }} />
			</div>

			<ImpressumModal setShow={setShowModal} show={showModal} />
		</>
	);
};
