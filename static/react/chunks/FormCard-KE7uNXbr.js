import{c as r,j as a}from"../app.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=r("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);function h({title:c,subtitle:s,action:t,method:n="POST",children:m,submitLabel:i="Save",error:e,success:l}){return a.jsxs("section",{className:"panel mx-auto max-w-xl",children:[a.jsxs("div",{className:"mb-5",children:[a.jsx("h2",{className:"section-title",children:c}),s?a.jsx("p",{className:"section-subtitle",children:s}):null]}),e?a.jsx("p",{className:"alert-danger mb-4",children:e}):null,l?a.jsx("p",{className:"alert-success mb-4",children:l}):null,a.jsxs("form",{action:t||location.pathname,method:n,className:"space-y-4",children:[m,a.jsxs("button",{className:"btn-primary w-full",type:"submit",children:[a.jsx(o,{className:"h-4 w-4"}),i]})]})]})}export{h as F};
