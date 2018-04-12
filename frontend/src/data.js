const mutluData = [
    {id:0,name:'GM-AM-6S-GM-172',sample:'Liver',file:'xGM-AM-6S-GM-172_S1_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-172_S1_L007_R1_001.bigWig'},
    {id:1,name:'GM-AM-6S-GM-173',sample:'Liver',file:'yGM-AM-6S-GM-173_S2_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-173_S2_L007_R1_001.bigWig'},
    {id:2,name:'GM-AM-6S-GM-174',sample:'Liver',file:'GM-AM-6S-GM-174_S3_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-174_S3_L007_R1_001.bigWig'},
    {id:3,name:'GM-AM-6S-GM-175',sample:'Liver',file:'GM-AM-6S-GM-175_S4_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-175_S4_L007_R1_001.bigWig'},
    {id:4,name:'GM-AM-6S-GM-176',sample:'Lung', file:'GM-AM-6S-GM-176_S5_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-176_S5_L007_R1_001.bigWig'},
    {id:5,name:'GM-AM-6S-GM-177',sample:'Lung', file:'GM-AM-6S-GM-177_S6_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-177_S6_L007_R1_001.bigWig'},
];
  
const kateOldData = [
  {id:0, name:'K1-mock', sample: 'K1-mock', file:'TW984_K1-mock_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW984_K1-mock_ATAC.R1.bigWig'},
  {id:1, name:'K2-ITF', sample: 'K2-ITF', file:'TW985_K2-ITF_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW985_K2-ITF_ATAC.R1.bigWig'},
  {id:2, name:'K3-Aza', sample: 'K3-Aza', file:'TW986_K3-Aza_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW986_K3-Aza_ATAC.R1.bigWig'},
  {id:3, name:'K4-AzaITF', sample: 'K4-AzaITF', file:'TW987_K4-AzaITF_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW987_K4-AzaITF_ATAC.R1.bigWig'},
];
  
const kateNewData = [
    {id:0, file:'http://wangftp.wustl.edu/~dli/hub/kate/WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.json', sample:'A2780-mock', assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.bigWig'},
    {id:1, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_A27802-ITF_i7N703_i5N503_AGGCAGAA_AGAGGATA_S3_R1_001.json', sample:'A27802-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_A27802-ITF_i7N703_i5N503_AGGCAGAA_AGAGGATA_S3_R1_001.bigWig'},
    {id:2, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_A27803-Aza_i7N703_i5N504_AGGCAGAA_TCTACTCT_S4_R1_001.json', sample:'A27803-Aza', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_A27803-Aza_i7N703_i5N504_AGGCAGAA_TCTACTCT_S4_R1_001.bigWig'},
    {id:3, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_A27804-Aza-ITF_i7N703_i5N517_AGGCAGAA_TCTTACGC_S5_R1_001.json', sample:'A27804-Aza-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_A27804-Aza-ITF_i7N703_i5N517_AGGCAGAA_TCTTACGC_S5_R1_001.bigWig'},
    {id:4, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey1-Mock_i7N701_i5N502_TAAGGCGA_ATAGAGAG_S10_R1_001.json', sample:'Hey1-Mock', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey1-Mock_i7N701_i5N502_TAAGGCGA_ATAGAGAG_S10_R1_001.bigWig'},
    {id:5, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey2-ITF_i7N701_i5N503_TAAGGCGA_AGAGGATA_S11_R1_001.json', sample:'Hey2-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey2-ITF_i7N701_i5N503_TAAGGCGA_AGAGGATA_S11_R1_001.bigWig'},
    {id:6, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey3-Aza_i7N701_i5N504_TAAGGCGA_TCTACTCT_S12_R1_001.json', sample:'Hey3-Aza', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey3-Aza_i7N701_i5N504_TAAGGCGA_TCTACTCT_S12_R1_001.bigWig'},
    {id:7, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey4-Aza-ITF_i7N701_i5N517_TAAGGCGA_TCTTACGC_S13_R1_001.json', sample:'Hey4-Aza-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey4-Aza-ITF_i7N701_i5N517_TAAGGCGA_TCTTACGC_S13_R1_001.bigWig'},
    {id:8, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu1-Mock_i7N702_i5N502_CGTACTAG_ATAGAGAG_S6_R1_001.json', sample:'TykNu1-Mock', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu1-Mock_i7N702_i5N502_CGTACTAG_ATAGAGAG_S6_R1_001.bigWig'},
    {id:9, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu2-ITF_i7N702_i5N503_CGTACTAG_AGAGGATA_S7_R1_001.json', sample:'TykNu1-Mock', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu2-ITF_i7N702_i5N503_CGTACTAG_AGAGGATA_S7_R1_001.bigWig'},
    {id:10, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu3-Aza_i7N702_i5N504_CGTACTAG_TCTACTCT_S8_R1_001.json', sample:'TykNu3-Aza', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu3-Aza_i7N702_i5N504_CGTACTAG_TCTACTCT_S8_R1_001.bigWig'},
    {id:11, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu4-Aza-ITF_i7N702_i5N517_CGTACTAG_TCTTACGC_S9_R1_001.json', sample:'TykNu4-Aza-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu4-Aza-ITF_i7N702_i5N517_CGTACTAG_TCTTACGC_S9_R1_001.bigWig'},  
];


const upennData = [
    {id:0,sample:'Twlab B6-1', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/B6-1.R1.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_B6-1.R1.bigWig'},
    {id:1,sample:'TwlabB6-2', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/B6-2.R1.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_B6-2.R1.bigWig'},
    {id:2,sample:'Twlab C7-1', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/C7-1.R1.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_C7-1.R1.bigWig'},
    {id:3,sample:'Twlab C7-2', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/WangT_C7-2_SIC0808_CTCCAGGGT_S11_R1_001.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_WangT_C7-2_SIC0808_CTCCAGGGT_S11_R1_001.bigWig'},
    {id:4, sample:"C72LIB8", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac3915147d1b127334fe16b.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac3915147d1b127334fe16b.SE.bigWig"},
    {id:5, sample: "C72LIB22", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac3911647d1b134554fe16a.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac3911647d1b134554fe16a.SE.bigWig"},
    {id:6, sample:"C71LIB18", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac3911647d1b1302d4fe169.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac3911647d1b1302d4fe169.SE.bigWig"},
    {id:7, sample:"B62LIB5", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac390d947d1b182104fe167.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac390d947d1b182104fe167.SE.bigWig"},
    {id:8, sample:"C71LIB17", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac390d947d1b17d124fe168.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac390d947d1b17d124fe168.SE.bigWig"},
    {id:9, sample:"B62LIB16", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac3909f48cb34d46ebe48d5.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac3909f48cb34d46ebe48d5.SE.bigWig"},
    {id:10, sample:"B61LIB4", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac3909e48cb346d34be48d4.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac3909e48cb346d34be48d4.SE.bigWig"},
    {id:11, sample:"B61LIB11", assay: "ATAC-seq" ,file:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/5ac3906147d1b151084fe166.SE.json", url:"http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_5ac3906147d1b151084fe166.SE.bigWig"},
];

const baylorData = [
    {id:0, sample: "baylor-rep2", assay: "ATAC-seq", file:"http://wangftp.wustl.edu/~dli/targetdcc/baylor/WangT_baylor-rep2.R1.json", url: "http://wangftp.wustl.edu/~dli/targetdcc/baylor/step3.2_Normalized_per_10M_WangT_baylor-rep2.R1.bigWig"},
    {id:1, sample: "baylor-rep1", assay: "ATAC-seq", file:"http://wangftp.wustl.edu/~dli/targetdcc/baylor/WangT_baylor-rep1.R1.json", url: "http://wangftp.wustl.edu/~dli/targetdcc/baylor/step3.2_Normalized_per_10M_WangT_baylor-rep1.R1.bigWig"},
    {id:2, sample: "Baylor2-Mliver", assay: "ATAC-seq", file:"http://wangftp.wustl.edu/~dli/targetdcc/baylor/WangT_Baylor2-Mliver.R1.json", url: "http://wangftp.wustl.edu/~dli/targetdcc/baylor/step3.2_Normalized_per_10M_WangT_Baylor2-Mliver.R1.bigWig"},
    {id:3, sample: "Baylor1-Mliver", assay: "ATAC-seq", file:"http://wangftp.wustl.edu/~dli/targetdcc/baylor/WangT_Baylor1-Mliver.R1.json", url: "http://wangftp.wustl.edu/~dli/targetdcc/baylor/step3.2_Normalized_per_10M_WangT_Baylor1-Mliver.R1.bigWig"},
];

export const allProducts = {
    'kateNewData': kateNewData,
    'kateOldData': kateOldData,
    'mutluData': mutluData,
    'upennData': upennData,
    'baylorData': baylorData
};

export const allOptions = [
    { value: 'baylorData', label: 'Baylor Data',  clearableValue: false },
    { value: 'upennData', label: 'Upenn Data',  clearableValue: false },
    { value: 'mutluData', label: 'Mutlu Data',  clearableValue: false },
    { value: 'kateNewData', label: 'Kate-ATAC1',  clearableValue: false  },
    { value: 'kateOldData', label: 'Kate ATAC',  clearableValue: false  },
];