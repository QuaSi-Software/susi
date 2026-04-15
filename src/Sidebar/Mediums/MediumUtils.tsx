import { createMedium } from '../../NodeDataStructures/Medium';

const getDefaultMediums = () => {
	return [
		createMedium('m_e_ac_230v', '#ffee00', 'm_e_ac_230v_DEFAULT_KEY'),
		createMedium('m_h_w_lt1', '#ff6c6c', 'm_h_w_lt1_DEFAULT_KEY'),
		createMedium('m_h_w_ht1', '#940000', 'm_h_w_ht1_DEFAULT_KEY'),
		createMedium('m_c_g_h2', '#00d346', 'm_c_g_h2_DEFAULT_KEY'),
		createMedium('m_c_g_o2', '#ff0000', 'm_c_g_o2_DEFAULT_KEY'),
		createMedium('m_c_g_natgas', '#6e00d4', 'm_c_g_natgas_DEFAULT_KEY'),
	];
};

export { getDefaultMediums };
