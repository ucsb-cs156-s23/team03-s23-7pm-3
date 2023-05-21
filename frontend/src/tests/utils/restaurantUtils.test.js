import { onDeleteSuccess, cellToAxiosParamsDelete, editCallback } from "main/utils/restaurantUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
	const originalModule = jest.requireActual('react-toastify');
	return {
		__esModule: true,
		...originalModule,
		toast: (x) => mockToast(x)
	};
});