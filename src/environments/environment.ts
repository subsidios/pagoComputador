// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// ng build --configuration=production
// ng build --prod=true

export const environment = {
  production: false,
  portalWeb: "https://confa.co/",
  personas: "https://confa.co/",
  empresas: "https://confa.co/empresas/",
  facebook: "https://www.facebook.com/Confacaldas/",
  twitter: "https://twitter.com/confacaldas",
  instagram: "https://www.instagram.com/confacaldas/",
  youtube: "https://www.youtube.com/user/Confamiliares",
  pagoDeAportes: "https://www.enlace-apb.com/interssi/.plus",
  acercaDeConfa: "https://confa.co/personas/acerca-de-confa/",
  servicios: [
    {
      nombreServicio: "Subsidios",
      linkServicio: "https://confa.co/personas/subsidios/",
    },
    {
      nombreServicio: "Vivienda",
      linkServicio: "https://confa.co/personas/vivienda/",
    },
    {
      nombreServicio: "Educación",
      linkServicio: "https://confa.co/personas/educacion/",
    },
    {
      nombreServicio: "Recreación",
      linkServicio: "https://confa.co/personas/recreacion/",
    },
    {
      nombreServicio: "Creditos",
      linkServicio: "https://confa.co/personas/creditos/",
    },
    {
      nombreServicio: "Alojamiento",
      linkServicio: "https://app.confa.co:8321/alojamiento",
    },
    {
      nombreServicio: "Salud",
      linkServicio: "https://app.confa.co:8321/salud",
    },
    {
      nombreServicio: "Boletines",
      linkServicio: "https://app.confa.co:8324/login",
    },
  ],
  contacto: "https://confa.co/personas/contacto/",
  viveConfa: "https://confa.co/personas/servicios-en-linea/",
  // Development
  //apiConsultaInfo: "http://localhost:8081/pagoSubsidioEspecieWS/rest/", //ruta de pruebas apuntando a genesys
  apiConsultaInfo: "https://app.confa.co:8377/pagoSubsidioEspecieWS/rest/", //ruta de pruebas apuntando a genesys
  //urlRetornoPagoCompu : "http://localhost:4200/#/login",
  urlRetornoPagoCompu : "https://app.confa.co:8355/#/login",
  /*   apiUrl: "http://localhost:4200/", */
  apiUrl: "https://app.confa.co:9340/",
  apiIngresoConfa: "https://app.confa.co:8687/ingresoConfaWSSGC/rest/", //ruta de pruebas apuntando a genesys
  /*  apiIngresoConfa:"http://localhost:8282/ingresoConfaWSS/rest/", //ruta en local */
  parametro1: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  parametro2: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
  apiCreditos: "https://app.confa.co:8320/creditosRestWS/creditos/",
  apiCreditosConsumo:
    "https://app.confa.co:8320/creditosConsumoPersonaRestWS/rest/creditos/",
  identificacionFacial:
    "https://app.confa.co:8687/transaccionAutenticacionWS/transaccion/",
  // identificacionFacial:
  //   "http://localhost:8081/transaccionAutenticacionWS/transaccion/",
  rutaRedireccionDca:
    "https://app.confa.co:9337/ProxyPublicoRadar/service/ejecutarOperacion/LoginCreditoDigital",
  consultarIp: "https://appint.confa.co/consultaIP/circular007/obtenerIP/",
  perfilConfa: "https://app.confa.co:8356/#/perfilConfaEmbed/",
  servicio: 1,
  rutaRedireccionDcaAsesor:
    "https://app.confa.co:9337/ProxyPublicoRadar/service/ejecutarOperacion/LoginCreditoDigitalAsesor",

  apiLDAP: "/services/",
  k: "9b1c0e0eb1b5e6b9",
  i: "2db11d27194a3751",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
