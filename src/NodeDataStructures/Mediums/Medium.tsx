interface Medium {
	name: string;
	key: string;
	color: string;
	valid: boolean;
}
const createMedium = (name: string, color: string, key: string) => {
	return {
		name: name,
		key: key,
		color: color,
		valid: true,
	};
};

export { type Medium, createMedium };
