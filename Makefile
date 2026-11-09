BUILD_DIR = build
BUILD_TYPE = Debug

.PHONY: all configure build clean run

all: build

configure:
	cmake -S . -B $(BUILD_DIR) -DCMAKE_BUILD_TYPE=$(BUILD_TYPE)

build: configure
	cmake --build $(BUILD_DIR) --config $(BUILD_TYPE) -j $(nproc)

clean:
	rm -r $(BUILD_DIR)
	rm -f src/assistant_cpp*.so
	rm -f src/assistant_cpp.pyi

run:
	python3 src/main.py