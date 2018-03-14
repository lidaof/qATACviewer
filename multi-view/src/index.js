import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));



//view-source:http://epigenome.wustl.edu/SE/emb.html
window.embed_washugb({
	host:'http://epgg-test.wustl.edu',
	container:document.getElementById('xxx'),
	genome:'hg19',
	noDeleteButton:true,
	noDefaultTrack:true,

        showContent:[
	        {type:'native_track',
                    list:[{name:'refGene',mode:'full'},
	        	{name:'rmsk_ensemble',mode:'show'},
        	    ],
                },

    {
        "show_terms": {
            "private": [
                "Assay", 
                "Cell", 
                "Donor", 
                "Tissue"
            ]
        }, 
        "type": "metadata", 
        "vocabulary_set": {
            "private": {
                "terms": {
                    "11": [
                        "Keratinocyte"
                    ], 
                    "12": [
                        "Fibroblast"
                    ], 
                    "13": [
                        "Melanocyte"
                    ], 
                    "14": [
                        "Luminal"
                    ], 
                    "15": [
                        "Myoepithelial"
                    ], 
                    "21": [
                        "Skin01"
                    ], 
                    "22": [
                        "Skin02"
                    ], 
                    "23": [
                        "Skin03"
                    ], 
                    "24": [
                        "RM066"
                    ], 
                    "25": [
                        "RM070"
                    ], 
                    "26": [
                        "RM080"
                    ], 
                    "31": [
                        "Skin"
                    ], 
                    "32": [
                        "Colon"
                    ], 
                    "33": [
                        "Breast"
                    ], 
                    "411": [
                        "MRE"
                    ], 
                    "412": [
                        "MeDIP"
                    ], 
                    "413": [
                        "mCRF"
                    ], 
                    "421": [
                        "H3K4me1"
                    ], 
                    "422": [
                        "H3K4me3"
                    ], 
                    "423": [
                        "H3K27ac"
                    ], 
                    "424": [
                        "DNase-seq"
                    ], 
                    "431": [
                        "TFBS sites"
                    ], 
                    "432": [
                        "DMRs"
                    ], 
                    "441": [
                        "RNA-seq"
                    ], 
                    "442": [
                        "miRNA-seq"
                    ], 
                    "51": [
                        "A09693"
                    ], 
                    "510": [
                        "A08398"
                    ], 
 
                }, 
                "vocabulary": {
                    "Assay": {
                        "DNA Methylation": [
                            "411", 
                            "412", 
                            "413"
                        ], 
                        "Expression": [
                            "441", 
                            "442"
                        ], 
                        "Histone Modification": [
                            "421", 
                            "422", 
                            "423", 
                            "424"
                        ], 
                        "Other": [
                            "431", 
                            "432"
                        ]
                    }, 
                    "Cell": [
                        "11", 
                    ], 
                    "Donor": [
                        "21", 
 
                    ], 
                    "Library": [
                        "51", 
 
                    ], 
                    "Tissue": [
                        "31", 
                    ]
                }
            }
        }
    }, 
    
    {
        "colorpositive": "#66CC33", 
        "fixedscale": {
            "max": 10, 
            "min": 0
        }, 
        "height": 20, 
        "metadata": {
            "private": [
                "11", 
                "23", 
                "31", 
                "411", 
                "531"
            ]
        }, 
        "mode": "show", 
        "name": "MRE of Kerationcyte", 
        "type": "bigwig", 
        "url": "http://remc.wustl.edu/dli/remcByTissue/Skin/Skin03_Keratinocyte_MRE_A13914.bigWig"
    }, 
    
    
]

	/*
	panelWidth:500,
	hideTopRuler:true,
	hideChromNavigator:true,
	leftSpaceWidth:60,
	hideTrackName:true,
	*/
});

registerServiceWorker();
