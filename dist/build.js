"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
	if ((from && typeof from === "object") || typeof from === "function") {
		for (let key of __getOwnPropNames(from))
			if (!__hasOwnProp.call(to, key) && key !== except)
				__defProp(to, key, {
					get: () => from[key],
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
				});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (
	(target = mod != null ? __create(__getProtoOf(mod)) : {}),
	__copyProps(
		// If the importer is in node compatibility mode or this is not an ESM
		// file that has been converted to a CommonJS file using a Babel-
		// compatible transform (i.e. "__esModule" has not been set), then set
		// "default" to the CommonJS "module.exports" for node compatibility.
		isNodeMode || !mod || !mod.__esModule
			? __defProp(target, "default", { value: mod, enumerable: true })
			: target,
		mod,
	)
);
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/build.ts
var build_exports = {};
__export(build_exports, {
	defines: () => defines,
	libraries: () => libraries,
	sources: () => sources,
});
module.exports = __toCommonJS(build_exports);
var import_node_os = __toESM(require("os"));
var cfg = config();
var sources = cfg.sources.join(" ");
var defines = cfg.defines.join(" ");
var libraries = cfg.libraries.join(" ");
function config() {
	var _a;
	if (process.env.BYOL) {
		return {
			sources: [],
			defines: [],
			libraries: [process.env.BYOL],
		};
	}
	const COMPUTE_BACKEND = (_a = process.env.COMPUTE_BACKEND) != null ? _a : infer_backend();
	const cfg2 = {
		sources: [
			"whisper.cpp/whisper.cpp",
			"whisper.cpp/ggml.c",
			"whisper.cpp/ggml-alloc.c",
			"whisper.cpp/ggml-backend.c",
			"whisper.cpp/ggml-quants.c",
		],
		defines: [],
		libraries: [],
	};
	switch (COMPUTE_BACKEND) {
		case "accelerate": {
			cfg2.defines.push("GGML_USE_ACCELERATE");
			cfg2.libraries.push('"-framework Foundation"');
			cfg2.libraries.push('"-framework Accelerate"');
			break;
		}
		case "metal": {
			cfg2.sources.push("whisper.cpp/ggml-metal.m");
			cfg2.defines.push("GGML_USE_ACCELERATE");
			cfg2.defines.push("GGML_USE_METAL");
			cfg2.libraries.push('"-framework Foundation"');
			cfg2.libraries.push('"-framework Accelerate"');
			cfg2.libraries.push('"-framework Metal"');
			cfg2.libraries.push('"-framework MetalKit"');
			break;
		}
		case "openblas": {
			cfg2.defines.push("GGML_USE_OPENBLAS");
			cfg2.libraries.push("-lopenblas");
			break;
		}
		case "clblast": {
			cfg2.sources.push("whisper.cpp/ggml-opencl.cpp");
			cfg2.defines.push("GGML_USE_CLBLAST");
			cfg2.libraries.push("-lclblast");
			if (import_node_os.default.platform() === "darwin") {
				cfg2.libraries.push("-framework OpenCL");
			} else {
				cfg2.libraries.push("-lOpenCL");
			}
			break;
		}
		default: {
		}
	}
	return cfg2;
}
function infer_backend() {
	let backend = "cpu";
	if (import_node_os.default.platform() === "darwin") {
		backend = "accelerate";
		if (import_node_os.default.arch() === "arm64") {
			backend = "metal";
		}
	}
	return backend;
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
	(module.exports = {
		defines,
		libraries,
		sources,
	});
