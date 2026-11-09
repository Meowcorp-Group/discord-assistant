cmake_minimum_required(VERSION 4.0.0)
project(assistant_cpp LANGUAGES CXX)

find_package(pybind11 REQUIRED)
find_package(PkgConfig REQUIRED)

pkg_check_modules(libqalculate REQUIRED IMPORTED_TARGET libqalculate)

pybind11_add_module(assistant_cpp cpp/assistant.cpp)

target_link_libraries(assistant_cpp PRIVATE PkgConfig::libqalculate)

set_target_properties(assistant_cpp PROPERTIES
	LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/src
)

add_custom_command(TARGET assistant_cpp POST_BUILD
	COMMAND ${CMAKE_COMMAND} -E env "PYTHONPATH=$<TARGET_FILE_DIR:assistant_cpp>"
	pybind11-stubgen assistant_cpp -o $<TARGET_FILE_DIR:assistant_cpp>
	COMMENT "Generating stub files for assistant_cpp"
)