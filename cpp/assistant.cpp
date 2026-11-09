#include <string>
#include <mutex>
#include <pybind11/pybind11.h>
#include <libqalculate/Calculator.h>
#include <libqalculate/MathStructure.h>

namespace py = pybind11;

struct CalcResult {
	int status;
	std::string input;
	std::string result;
};

std::once_flag calc_init;

void init_calculator() {
	std::call_once(calc_init, []() {
		new Calculator();

		CALCULATOR->loadGlobalDefinitions();
		CALCULATOR->loadLocalDefinitions();
		CALCULATOR->loadExchangeRates();
	});
}

CalcResult evaluate_expression(const std::string& expression) {
	using namespace pybind11::literals;

	init_calculator();

	PrintOptions po;
	po.use_unicode_signs = UNICODE_SIGNS_ON;
	po.short_multiplication = false;

	MathStructure expr = CALCULATOR->parse(expression);
	po.abbreviate_names = false;
	std::string interpreted_input = expr.print(po);

	MathStructure res = CALCULATOR->calculate(expr);
	po.abbreviate_names = true;
	std::string result = res.print(po);

	CalcResult out;
	out.status = 0;
	out.input = interpreted_input;
	out.result = result;

	return out;
}

PYBIND11_MODULE(assistant_cpp, m, py::mod_gil_not_used()) {
	m.doc() = "C++ module for Assistant";
	py::class_<CalcResult>(m, "CalcResult")
		.def_readonly("status", &CalcResult::status)
		.def_readonly("input", &CalcResult::input)
		.def_readonly("result", &CalcResult::result);
	m.def("evaluate_expression", &evaluate_expression, "evaluate a mathematical expression using libqalculate");
}