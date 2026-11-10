#include <string>
#include <mutex>
#include <stdexcept>
#include <pybind11/pybind11.h>
#include <libqalculate/Calculator.h>
#include <libqalculate/MathStructure.h>
#include <libqalculate/Unit.h>

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

		Unit *litre = CALCULATOR->getUnit("liter");
		if (litre) {
			AliasUnit *bucket = new AliasUnit(
				"Volume",
				"Bk",
				"buckets",
				"bucket",
				"Minecraft Bucket",
				litre,
				"1000"
			);
			CALCULATOR->addUnit(bucket);
		}
	});
}

CalcResult evaluate_expression(const std::string& expression) {
	init_calculator();

	if (expression.empty()) {
		throw py::value_error("Expression cannot be empty.");
	}

	std::string clean_expr = CALCULATOR->unlocalizeExpression(expression);

	PrintOptions input_print_options = default_print_options;
	input_print_options.use_unicode_signs = UNICODE_SIGNS_ON;
	input_print_options.short_multiplication = false;
	input_print_options.abbreviate_names = false;

	PrintOptions result_print_options = default_print_options;
	result_print_options.use_unicode_signs = UNICODE_SIGNS_ON;
	result_print_options.short_multiplication = false;

	MathStructure input_expr;
	MathStructure to_expr;
	MathStructure result_expr;

	CalculatorMessage *msg;

	while ((msg = CALCULATOR->message())) {
		delete msg;
	}

	bool success = false;
	try {
		py::gil_scoped_release release;
		
		success = CALCULATOR->calculate(
			&result_expr,
			clean_expr,
			2000, // ms
			default_evaluation_options,
			&input_expr,
			&to_expr,
			true
		);

	} catch (const std::exception& e) {
		throw std::runtime_error(std::string("Error evaluating expression: ") + e.what());
	}

	if (!success) {
		throw std::runtime_error("Calculation timed out or failed.");
	}

	std::string interpreted_input = input_expr.print(input_print_options);
	std::string to_str = to_expr.print(input_print_options);
	if (!to_str.empty() && to_str != "0") {
		interpreted_input += " to " + to_str;
	}

	std::string result = result_expr.print(result_print_options);

	std::string final_error_msg = "";
	while ((msg = CALCULATOR->message())) {
		if (msg->type() == MESSAGE_ERROR && final_error_msg.empty()) {
			final_error_msg = msg->message();
		}
		delete msg;
	}
	if (!final_error_msg.empty()) {
		throw py::value_error("Qalculate! Error: " + final_error_msg);
	}

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