class BusData {
	inputOrder: Array<string>;
	outputOrder: Array<string>;
	energyFlow: Array<Array<number>>;

	constructor(
		inputOrder: Array<string> = [],
		outputOrder: Array<string> = [],
		energyFlow: Array<Array<number>> = []
	) {
		this.inputOrder = inputOrder;
		this.outputOrder = outputOrder;
		this.energyFlow = energyFlow;
	}

	setInputOrder(newInputOrder: Array<string>) {
		let newEnergyFlow: Array<Array<number>> = [];
		newInputOrder.forEach((nodeID) => {
			let oldIndex = this.inputOrder.findIndex((id) => nodeID === id);
			newEnergyFlow.push(this.energyFlow[oldIndex]);
		});
		this.inputOrder = newInputOrder;
		this.energyFlow = newEnergyFlow;
	}

	setOutputOrder(newOutputOrder: Array<string>) {
		// outputs are columns
		let newEnergyFlow: Array<Array<number>> = [];
		this.energyFlow.forEach((row) => {
			// reorder each row of the energy flow matrix according to the new output order
			let newRow: Array<number> = [];
			newOutputOrder.forEach((nodeID) => {
				let oldIndex = this.outputOrder.findIndex((id) => nodeID === id);
				let energyFlowElement = row[oldIndex];
				newRow.push(energyFlowElement);
			});
			newEnergyFlow.push(newRow);
		});
		this.energyFlow = newEnergyFlow;
	}

	addToInputOrder(nodeID: string) {
		this.inputOrder.push(nodeID);
		let newRow = this.outputOrder.map(() => 1);
		this.energyFlow.push(newRow);
	}

	addToOutputOrder(nodeID: string) {
		this.outputOrder.push(nodeID);
		this.energyFlow.forEach((row) => {
			row.push(1);
		});
	}

	removeFromInputOrder(nodeID: string) {
		// remove row at index as the disconnected node id is in the incoming order array
		let index = this.inputOrder.findIndex((id) => id === nodeID);
		this.inputOrder.splice(index, 1);
		this.energyFlow.splice(index, 1);
	}
	removeFromOutputOrder(nodeID: string) {
		// find index of node id in outgoin order
		let index = this.outputOrder.findIndex((id) => id === nodeID);
		this.outputOrder.splice(index, 1);
		// in every row, remove the item at index
		this.energyFlow.forEach((row) => {
			row.splice(index, 1);
		});
	}
}

export default BusData;
