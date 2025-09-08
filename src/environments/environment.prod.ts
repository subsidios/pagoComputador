export const environment = {
  production: true,
  // Production
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

  apiUrl: "https://app.confa.co:8340/",

  // produccion
  // comentar letrero de pruebas en el welcome
  apiIngresoConfa: "https://alojamiento.confa.co/ingresoConfaWSS/rest/",
  parametro1: "ZTM4ZDcwNDRlODcyNzZDX0FQUCoyMDE4JA==",
  parametro2: "QXBwX0NvbmZhODRkZGZiMzQxMjZmYzNhNDhl",
  consultarIp: "https://appint.confa.co/consultaIP/circular007/obtenerIP/",
  identificacionFacial:
    "https://identidad.confa.co/transaccionAutenticacionWS/transaccion/",
  rutaRedireccionDca:
    "https://app.confa.co:8337/ProxyPublicoRadar/service/ejecutarOperacion/LoginCreditoDigital",
  apiCreditos: "https://app.confa.co:8337/creditosRestWS/creditos/",
  apiCreditosConsumo:
    "https://app.confa.co:8337/creditosConsumoPersonaRestWS/rest/creditos/",
  perfilConfa: "https://app.confa.co::8376/#/perfilConfaEmbed/",
  servicio: 1,
  rutaRedireccionDcaAsesor:
    "https://app.confa.co:8337/ProxyPublicoRadar/service/ejecutarOperacion/LoginCreditoDigitalAsesor",

  // test
  //   apiIngresoConfa: "https://app.confa.co:8687/ingresoConfaWSSpruebas/rest/",
  //   parametro1: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  //   parametro2: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
  //   consultarIp: "https://appint.confa.co/consultaIP/circular007/obtenerIP/",

  //   apiCreditos: "https://app.confa.co:8320/creditosRestWS/creditos/",
  //   apiCreditosConsumo:
  //     "https://app.confa.co:8320/creditosConsumoPersonaRestWS/rest/creditos/",
  //   identificacionFacial:
  //     "https://app.confa.co:8687/transaccionAutenticacionWS/transaccion/",
  //   rutaRedireccionDca:
  //     "https://app.confa.co:9337/ProxyPublicoRadar/service/ejecutarOperacion/LoginCreditoDigital",
  //   // rutaRedireccionDca:
  //   //   "https://app.confa.co:8320/ProxyPublicoRadar/service/ejecutarOperacion/LoginCreditoDigital",
  apiLDAP: "/services/",
  k: "9b1c0e0eb1b5e6b9",
  i: "2db11d27194a3751",
};
