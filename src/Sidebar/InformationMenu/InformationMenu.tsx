import { useState } from 'react';
import { ImpressumModal } from './ImpressumModal';
import fundingDisclaimer from './../../assets/funding_disclaimer.png';

export const InformationMenu = () => {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<div className="sidebar-subheading">Steinbeis Innovation Zentrum</div>
			<div>Lorem ipsum dolor</div>
			<div className="sidebar-subheading">Funding Disclaimer </div>
			<div>Lorem ipsum dolor</div>
			<br />
			<button type="button" className="link-button sidebar-subheading" onClick={() => setShowModal(true)}>
				<i className="bi bi-box-arrow-up-right"></i> Impressum
			</button>
			<br />
			<div>
				<img src={fundingDisclaimer} style={{ width: '80%', padding: '1em 0em' }} />
			</div>

			<ImpressumModal setShow={setShowModal} show={showModal} />
		</>
	);
};
