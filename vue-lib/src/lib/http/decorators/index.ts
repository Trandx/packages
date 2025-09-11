// // src/services/decorators.ts

// import { Reflect } from "../refect-metadata";
// import {  HttpService, type QueryOptionsType } from "../service";

// export interface BaseServiceClass {
//   __basePath?: string;
// }

// export function Service(basePath: string) {
//   return (target: Function) => {
//     Reflect.defineMetadata("__basePath", basePath, target);
//   };
// }

// function makeServiceDecorator(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") {
//   return function (path: string) {
//     return function (
//       target: Object,
//       propertyKey: string | symbol,
//       descriptor: PropertyDescriptor
//     ): void {
//       const originalMethod = descriptor.value as Function;
//       descriptor.value = async function (this: BaseServiceClass, options?: QueryOptionsType) {
//         const basePath = Reflect.getMetadata("__basePath", target.constructor) || "";

//         const response = await HttpService().send(method, basePath + path, options);

//         // run your original method
//         const localResult = await originalMethod.apply(this, [options, response]);

//         return  localResult || response;
//       };
//     };
//   };
// }

// export const Get = makeServiceDecorator("GET");
// export const Post = makeServiceDecorator("POST");
// export const Put = makeServiceDecorator("PUT");
// export const Patch = makeServiceDecorator("PATCH");
// export const Delete = makeServiceDecorator("DELETE");
