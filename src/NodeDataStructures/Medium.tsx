interface Medium {
	name: string;
	key: string;
	color: string;
}
const createMedium = (name: string, color: string, key: string) => {
	return {
		name: name,
		key: key,
		color: color,
	};
};

export { type Medium, createMedium };
