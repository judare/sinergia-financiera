const records = [
  {
    processCode: "ONB-1001",
    fullName: "Carlos Ramirez",
    documentType: "CC",
    documentNumber: "100000001",
    positionId: "43",
    startDate: "2026-05-01",
  },
  {
    processCode: "ONB-1002",
    fullName: "Laura Martinez",
    documentType: "CC",
    documentNumber: "100000002",
    positionId: "46",
    startDate: "2026-05-02",
  },
  {
    processCode: "ONB-1003",
    fullName: "Andres Gomez",
    documentType: "DNI",
    documentNumber: "100000003",
    positionId: "11",
    startDate: "2026-05-03",
  },
  {
    processCode: "ONB-1004",
    fullName: "Valentina Rojas",
    documentType: "PASAPORTE",
    documentNumber: "100000004",
    positionId: "17",
    startDate: "2026-05-04",
  },
  {
    processCode: "ONB-1005",
    fullName: "Santiago Perez",
    documentType: "CC",
    documentNumber: "100000005",
    positionId: "25",
    startDate: "2026-05-05",
  },
  {
    processCode: "ONB-1006",
    fullName: "Mariana Castro",
    documentType: "CC",
    documentNumber: "100000006",
    positionId: "43",
    startDate: "2026-05-06",
  },
  {
    processCode: "ONB-1007",
    fullName: "Daniel Torres",
    documentType: "DNI",
    documentNumber: "100000007",
    positionId: "41",
    startDate: "2026-05-07",
  },
  {
    processCode: "ONB-1008",
    fullName: "Paula Herrera",
    documentType: "CC",
    documentNumber: "100000008",
    positionId: "20",
    startDate: "2026-05-08",
  },
  {
    processCode: "ONB-1009",
    fullName: "Juan Esteban Ruiz",
    documentType: "CC",
    documentNumber: "100000009",
    positionId: "32",
    startDate: "2026-05-09",
  },
  {
    processCode: "ONB-1010",
    fullName: "Sara Delgado",
    documentType: "PASAPORTE",
    documentNumber: "100000010",
    positionId: "55",
    startDate: "2026-05-10",
  },
  {
    processCode: "ONB-1011",
    fullName: "Felipe Moreno",
    documentType: "CC",
    documentNumber: "100000011",
    positionId: "42",
    startDate: "2026-05-11",
  },
  {
    processCode: "ONB-1012",
    fullName: "Natalia Silva",
    documentType: "CC",
    documentNumber: "100000012",
    positionId: "18",
    startDate: "2026-05-12",
  },
  {
    processCode: "ONB-1013",
    fullName: "Camilo Vargas",
    documentType: "DNI",
    documentNumber: "100000013",
    positionId: "24",
    startDate: "2026-05-13",
  },
  {
    processCode: "ONB-1014",
    fullName: "Juliana Medina",
    documentType: "CC",
    documentNumber: "100000014",
    positionId: "38",
    startDate: "2026-05-14",
  },
  {
    processCode: "ONB-1015",
    fullName: "David Castaño",
    documentType: "CC",
    documentNumber: "100000015",
    positionId: "7",
    startDate: "2026-05-15",
  },
  {
    processCode: "ONB-1016",
    fullName: "Karen Muñoz",
    documentType: "DNI",
    documentNumber: "100000016",
    positionId: "49",
    startDate: "2026-05-16",
  },
  {
    processCode: "ONB-1017",
    fullName: "Jorge Pineda",
    documentType: "CC",
    documentNumber: "100000017",
    positionId: "53",
    startDate: "2026-05-17",
  },
  {
    processCode: "ONB-1018",
    fullName: "Tatiana Quintero",
    documentType: "PASAPORTE",
    documentNumber: "100000018",
    positionId: "21",
    startDate: "2026-05-18",
  },
  {
    processCode: "ONB-1019",
    fullName: "Ricardo Salazar",
    documentType: "CC",
    documentNumber: "100000019",
    positionId: "45",
    startDate: "2026-05-19",
  },
  {
    processCode: "ONB-1020",
    fullName: "Angela Restrepo",
    documentType: "CC",
    documentNumber: "100000020",
    positionId: "35",
    startDate: "2026-05-20",
  },
];

const cookie = `talkia.session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmdWxsTmFtZSI6Ikp1YW4gRGF2aWQgUmVzdHJlcG9zIiwiZW1haWwiOiJmb3NlYmFkZ2FtZUBnbWFpbC5jb20iLCJhcmVhSWQiOjF9LCJpYXQiOjE3NzkzODcxOTZ9.p2zihR8NWLPNk6KCp3_cb222oWOEfX_n84b8yXnXra8`;

async function createOnboarding(data) {
  try {
    const res = await fetch(
      "https://sinergia-financiera.vercel.app/api/onboarding/create",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          cookie,
        },
        body: JSON.stringify({
          data,
          _version: "1.0.1",
          _channel: "Script",
        }),
      },
    );

    const json = await res.json();

    console.log("OK", data.processCode, json);
  } catch (err) {
    console.error("ERROR", data.processCode, err.message);
  }
}

(async () => {
  for (const item of records) {
    await createOnboarding(item);

    // evita rate limit
    await new Promise((r) => setTimeout(r, 500));
  }
})();
