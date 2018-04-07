const mutluData = [
    {id:0,name:'GM-AM-6S-GM-172',sample:'Liver',file:'xGM-AM-6S-GM-172_S1_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-172_S1_L007_R1_001.bigWig'},
    {id:1,name:'GM-AM-6S-GM-173',sample:'Liver',file:'GM-AM-6S-GM-173_S2_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-173_S2_L007_R1_001.bigWig'},
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
  {id:4, name:'A2780-mock', sample: 'A2780-mock', file:'WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.bigWig'}
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
    {id:12, file:'https://target.wustl.edu/processed/fromHTCF/5aa236a64f037480c3c6dc30/5aa236a64f037480c3c6dc30.SE.json', sample:'test', assay:'ATAC-seq',url:'https://target.wustl.edu/processed/fromHTCF/5aa236a64f037480c3c6dc30/step3.2_Normalized_per_10M_5aa236a64f037480c3c6dc30.SE.bigWig'},
];


const upennData = [
    {id:0,sample:'B6-1', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/B6-1.R1.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_B6-1.R1.bigWig'},
    {id:1,sample:'B6-2', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/B6-2.R1.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_B6-2.R1.bigWig'},
    {id:2,sample:'C7-1', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/C7-1.R1.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_C7-1.R1.bigWig'},
    {id:3,sample:'C7-2', assay:'ATAC-seq',file:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/WangT_C7-2_SIC0808_CTCCAGGGT_S11_R1_001.json', url:'http://wangftp.wustl.edu/~dli/targetdcc/upenn/step3.2_Normalized_per_10M_WangT_C7-2_SIC0808_CTCCAGGGT_S11_R1_001.bigWig'},
];

export const allProducts = {
    'kateNewData': kateNewData,
    'kateOldData': kateOldData,
    'mutluData': mutluData,
    'upennData': upennData
};

export const allOptions = [
    { value: 'upennData', label: 'Upenn Data',  clearableValue: false },
    { value: 'mutluData', label: 'Mutlu Data',  clearableValue: false },
    { value: 'kateNewData', label: 'Kate New Date',  clearableValue: false  },
    { value: 'kateOldData', label: 'Kate Old Date',  clearableValue: false  },
];