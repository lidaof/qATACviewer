import sys,os,json,math
from flask import Flask, request
from flask import jsonify
app = Flask(__name__)
try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen

def parse_report(f):
    d = {}
    with open(f) as fin:
        for line in fin:
            t = line.strip().split()
            if len(t) < 4: continue
            k = ' '.join(t[:-2])
            v1 = t[-2]
            v2 = t[-1].split('(')[0]
            d[k] = [s2n(v1),s2n(v2)]
    return d

def s2n(s):
    '''safely convert string to numbers, return int, float if float or percetage'''
    if '%' in s:
        return float(s.strip('%'))/100.0
    elif '.' in s:
        return float(s)
    else:
        return int(s)

def average(values):
    return float(format(sum(values, 0.0) / len(values), '.3f'))

def sd(values):
    ave = average(values)
    var = [(i - ave) ** 2 for i in values]
    return float(format(math.sqrt(average(var)), '.3f'))

def cal_score(d):
    # d is the sample info hash
    score = 0
    single = d['mapping_stats']['useful_single_ends']
    enrp = d['enrichment']['enrichment_score_in_coding_promoter_regions']
    enrs = d['enrichment']['subsampled_10M_enrichment_score']
    bk = d['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']
    rup = d['peak_analysis']['reads_percentage_under_peaks']
    if single >= 40000000:
        score += 2
    elif single >= 25000000 and single < 40000000:
        score += 1
    else:
        score -= 1
    if enrp >= 11:
        score += 2
    elif enrp >= 7 and enrp < 11:
        score += 1
    else:
        score -= 1
    if enrs >= 18:
        score += 2
    elif enrs >= 15 and enrs < 18:
        score += 1
    else:
        score -= 1
    if rup >= 0.2:
        score += 2
    elif rup >= 0.12 and rup < 0.2:
        score += 1
    else:
        score -= 1
    if bk <= 0.1:
        score += 2
    elif bk > 0.1 and bk <= 0.2:
        score += 1
    else:
        score -= 1
    return score
    

def format_text_report(flist):
    d = {}
    flis = flist.split(',')
    #flis.sort()
    for f in flis:
        k = os.path.basename(f)
        d[k] = parse_report(f)
    #print d
    kf = [os.path.basename(x) for x in flis]
    #mapping
    header = ['Total reads','Mapped reads','Non-redundant uniquely mapped reads','Useful reads']
    header2 = ['Percentage of uniquely mapped reads in chrM','Percentage of reads in chrX','Percentage of reads in chrX']
    header3 = ['Before alignment library duplicates percentage','After alignment PCR duplicates percentage']
    header4 = ['Useful reads ratio','Percentage of background RPKM smaller than 0.3777']
    header5 = ['Number of peaks','Reads under peaks ratio']
    outheader = {
        'mapping':header,
        'chrM rate':header2,
        'library complexity': header3,
        'enrichment':header4,
        'peaks':header5
    }
    results = {}
    # the results stucture was optimized for raw d3 usage
    # the results stucture was optimized for react-d3-components usage
    # the results stucture was optimized for recharts usage
    for oh in outheader:
        results[oh] = []
        for idxk,k in enumerate(kf):
            td = {}
            sampleName = k.split('_')[0]
            td['name'] = sampleName
            for h in outheader[oh]:    
                td[h] = d[k][h][0]
            results[oh].append(td)
            if idxk == len(kf) - 1:
                td1 = {}
                td1['name'] = 'ENCODE'
                for h in outheader[oh]:
                    td1[h] = d[k][h][1]
                results[oh].append(td1)            
    return results

def remove_spaces(obj):
    for key in obj.keys():
        new_key = key.replace(" ","_")
        if new_key != key:
            obj[new_key] = obj[key]
            del obj[key]
    return obj

section1 = ['total_reads','mapped_reads','uniquely_mapped_reads','non-redundant_mapped_reads','useful_single_ends']
section2 = ['percentage_of_uniquely_mapped_reads_in_chrM','percentage_of_non-redundant_uniquely_mapped_reads_in_chrX','percentage_of_non-redundant_uniquely_mapped_reads_in_chrY','Percentage_of_non-redundant_uniquely_mapped_reads_in_autosome']
section3 = ['before_alignment_library_duplicates_percentage','after_alignment_PCR_duplicates_percentage']
section4 = ['enrichment_score_in_coding_promoter_regions', 'subsampled_10M_enrichment_score', 'percentage_of_background_RPKM_larger_than_0.3777']
section5 = ['reads_number_under_peaks', 'peaks_number_in_promoter_regions','peaks_number_in_non-promoter_regions', 'reads_percentage_under_peaks']
section6 = ['insertion_size','density']
section7 = ['peak_length','density']
section8 = ['total_reads','expected_distinction','lower_0.95_confidnece_interval','upper_0.95_confidnece_interval']
section9 = ['sequence_depth','peaks_number','percentage_of_peak_region_recaptured']

headers = {
    'mapping_stats':section1,
    'mapping_distribution':section2,
    'library_complexity': section3,
    'enrichment':section4,
    'peak_analysis':section5,
    'insertion_size_distribution':section6,
    'peak_length_distribution': section7,
    'yield_distribution': section8,
    'saturation': section9
}

rna_section1 = ['reads_aligned_exactly_1_time','reads_aligned_0_time','reads_aligned_greater_than_1_time']
rna_section2 = ['before_alignment_library_duplicates_percentage','after_alignment_PCR_duplicates_percentage']
rna_section3 = ['rate_of_reads_with_gene_feature','area_under_curve_of_gene_body_coverage','expressed_genes_with_cpm_larger_than_1','gene_type_fragment_count']
rna_section4 = ['total_reads','expected_distinction']
rna_section5 = ['percentile','coverage']
rna_section6 = ['GC_content','reads_distribution','splice_junction','splice_events']
rna_section7 = ['sequence_depth','cpm_from_1_to_10','cpm_from_10_to_50','cpm_greater_than_50','total_genes']

rna_headers = {
    'mapping_stats': rna_section1,
    'library_complexity': rna_section2,
    'feature_counting': rna_section3,
    'yield_distribution': rna_section4,
    'gene_body_covergae': rna_section5,
    'RseQC_report': rna_section6,
    'saturation': rna_section7,
}

def parse_json_list(flist, labels, assays):
    d = {} # key: filename, value: parsed json content, put key error if there is something wrong loading json content, value would a list of file or URLs failed loading json
    d['error'] = []
    for fi,f in enumerate(flist):
        #print f
        #label = f
        #label = f.split('/')[-1].split('_')[0]
        #label = f.split('/')[-1]
        label = labels[fi]
        assay = assays[fi]
        content = ''
        if f.startswith('http'):
            try:
                content = json.load(urlopen(f))
            except:
                d['error'].append(f)
        else:
            try: #file open error
                with open(f,"rU") as fin:
                    try: # json load error
                        content = json.load(fin)
                    except:
                        d['error'].append(f)
            except:
                d['error'].append(f)
        if content: # means json loaded correctly
            new_content = json.loads(json.dumps(content), object_hook=remove_spaces)
            d[label] = [new_content, assay]
            #print content
            #print new_content
    #print d
    return d

def reformat_dict(lst, key):
    results = []
    results_keys = {} #key: category, like regions, value: {sample: count}
    for ele in lst:
        for k in ele[key]:
            if k not in results_keys:
                results_keys[k] = {ele['name']: ele[key][k]}
            else:
                results_keys[k][ele['name']] = ele[key][k]
    for k in sorted(results_keys.keys()):
        tmp = {'name': k}
        for j in lst:
            if j['name'] in results_keys[k]:
                tmp[j['name']] = results_keys[k][j['name']]
            else:
                tmp[j['name']] = 0
        results.append(tmp)
    return results

def reformat_array(lst, key1, key2):
    '''
    reformat the array for used by recharts directly, lst is the data, key1 is x-axis, and key2 is y-axis
    '''
    results = [] # each elmemnt is {name: insert_size, file1: frequency1, file2: freq2, ...}
    results_keys = {} # key: insert size, value: {filenames: frequencys}
    for k in lst:
        for idx,j in enumerate(k[key1]):
            if isinstance(key2, list):
                for kkey2 in key2:
                    if kkey2 in k:
                        rkey2 = kkey2
            else:
                rkey2 = key2 
            if j not in results_keys:
                results_keys[j] = {k['name']: k[rkey2][idx]}
            else:
                results_keys[j][k['name']] = k[rkey2][idx]
    for k in sorted(results_keys.keys()):
        tmp = {'name': k}
        for j in lst:
            if j['name'] in results_keys[k]:
                tmp[j['name']] = results_keys[k][j['name']]
            else:
                tmp[j['name']] = 0
        results.append(tmp)
    return results


def format_result(d):
    dd = {} # key: assay: value: {label: content}
    for k in d:
        #k is label
        if k == 'error': continue
        content, assay = d[k]
        if assay not in dd:
            dd[assay] = {}
        if k not in dd[assay]: 
            dd[assay][k] = content
        else:
            raise ValueError('dup label {}'.format(k))
    results = {}
    results['error'] = d['error']
    for k in dd:
        if 'atac' in k.lower():
            results['atac'] = format_result_atac(dd[k])
        elif 'rna' in k.lower():
            results['rna'] = format_result_rna(dd[k])
        else:
            raise ValueError('not supported assay type {}'.format(k))
    return results

def format_result_rna(d):
    results = {}
    for h in rna_headers:
        results[h] = []
        for f in sorted(d.keys()):
            tmp = {}
            tmp['name'] = f
            for k in rna_headers[h]:
                tmp[k] = d[f][h][k]
            results[h].append(tmp)
    #yield
    results['yield_distro'] = reformat_array(results['yield_distribution'], 'total_reads', 'expected_distinction')
    #genebody
    results['genebody'] = reformat_array(results['gene_body_covergae'],'percentile','coverage')
    # saturation
    results['saturation_cpm_from_1_to_10'] = reformat_array(results['saturation'],'sequence_depth','cpm_from_1_to_10')
    results['saturation_cpm_from_10_to_50'] = reformat_array(results['saturation'],'sequence_depth','cpm_from_10_to_50')
    results['saturation_cpm_greater_than_50'] = reformat_array(results['saturation'],'sequence_depth','cpm_greater_than_50')
    results['saturation_total_genes'] = reformat_array(results['saturation'],'sequence_depth','total_genes')
    results['gene_type'] = reformat_dict(results['feature_counting'], 'gene_type_fragment_count')
    results['gc_content'] = reformat_dict(results['RseQC_report'], 'GC_content')
    results['reads_distribution'] = reformat_dict(results['RseQC_report'], 'reads_distribution')
    results['splice_junction'] = reformat_dict(results['RseQC_report'], 'splice_junction')
    results['splice_events'] = reformat_dict(results['RseQC_report'], 'splice_events')
    return results
                

def format_result_atac(d):
    results = {}
    #results['error'] = d['error']
    #ef = '' # encode f, make sure encode ref came from correct json
    for h in headers:
        results[h] = []
        for f in sorted(d.keys()):
            #if f == 'error': 
                #results['error'].extend(d[f])
                #continue
            tmp = {}
            tmp['name'] = f
            for k in headers[h]:
                if isinstance(k, list): #some reports return frequency and some returns density....or has the ability to deal with key changes, add all possible keys for this paramter
                    for kk in k:
                        if kk in d[f]['Sample_QC_info'][h]:
                            tmp[kk] = d[f]['Sample_QC_info'][h][kk]
                else:
                    tmp[k] = d[f]['Sample_QC_info'][h][k]
            results[h].append(tmp)
            ef = f
    #print results['mapping_distribution']
    # add encode
    #results['ENCODE_PE_refernce'] = d[f]['ENCODE_PE_refernce']
    # re-format chromosome/autosome distribution
    auto_distro = {} #key: file name, value: [{chromosome: '', index:1, value: xxx},...]
    for k in results['mapping_distribution']:
        tmp = []
        for j,jv in k['Percentage_of_non-redundant_uniquely_mapped_reads_in_autosome'].items():
            if '_' not in j:
                tmp.append({'chromosome': j, 'index': 1, 'value': jv})
        auto_distro[k['name']] = tmp
    results['autosome_distribution'] =  auto_distro
    #insert size
    results['insert_distribution'] = reformat_array(results['insertion_size_distribution'],'insertion_size',['density', 'frequency'])
    #peak size
    results['peak_distribution'] = reformat_array(results['peak_length_distribution'], 'peak_length',['density', 'frequency'])
    #yield
    results['yield_distro'] = reformat_array(results['yield_distribution'], 'total_reads', 'expected_distinction')
    results['yield_distro_lower'] = reformat_array(results['yield_distribution'], 'total_reads', 'lower_0.95_confidnece_interval')
    results['yield_distro_upper'] = reformat_array(results['yield_distribution'], 'total_reads', 'upper_0.95_confidnece_interval')
    # saturation
    results['saturation_peaks'] = reformat_array(results['saturation'],'sequence_depth','peaks_number')
    results['saturation_peaks_pct'] = reformat_array(results['saturation'],'sequence_depth','percentage_of_peak_region_recaptured')
    
    #scores
    results['scores'] = [] # save score for each sample, array of {file/label: score}
    c = 0
    for f in sorted(d.keys()):
        if f == 'error': 
            continue
        dt = {}
        dt['id'] = c
        dt['sample'] = f
        dt['score'] = cal_score(d[f]['Sample_QC_info'])
        results['scores'].append(dt)
        c += 1
    # encode ref standard
    #if not ef: return results # encode ref cannot be read
    ref = {}
    #refernce...what's the f...
    # eckey = 'ENCODE_PE_reference'
    # if eckey not in d[ef]: # deal with key typo
    #     eckey = 'ENCODE_PE_refernce'
    ref['mapping'] = {}
    # ref['mapping']['total'] = {}
    # ref['mapping']['total']['mean'] = average(d[ef][eckey]['mapping_stats']['total_reads'])
    # ref['mapping']['total']['sd'] = sd(d[ef][eckey]['mapping_stats']['total_reads'])
    # ref['mapping']['mapped'] = {}
    # ref['mapping']['mapped']['mean'] = average(d[ef][eckey]['mapping_stats']['mapped_reads'])
    # ref['mapping']['mapped']['sd'] = sd(d[ef][eckey]['mapping_stats']['mapped_reads'])
    # ref['mapping']['unimap'] = {}
    # ref['mapping']['unimap']['mean'] = average(d[ef][eckey]['mapping_stats']['uniquely_mapped_reads'])
    # ref['mapping']['unimap']['sd'] = sd(d[ef][eckey]['mapping_stats']['uniquely_mapped_reads'])
    # ref['mapping']['nonredant'] = {}
    # ref['mapping']['nonredant']['mean'] = average(d[ef][eckey]['mapping_stats']['non-redundant_mapped_reads'])
    # ref['mapping']['nonredant']['sd'] = sd(d[ef][eckey]['mapping_stats']['non-redundant_mapped_reads'])
    # ref['mapping']['useful'] = {}
    # ref['mapping']['useful']['mean'] = average(d[ef][eckey]['mapping_stats']['useful_reads'])
    # ref['mapping']['useful']['sd'] = sd(d[ef][eckey]['mapping_stats']['useful_reads'])
    ref['mapping']['useful_single'] = {}
    ref['mapping']['useful_single']['mean'] = 40000000
    ref['mapping']['useful_single']['sd'] = 15000000
    # ref['library_complexity'] = {}
    # ref['library_complexity']['after'] = {}
    # ref['library_complexity']['after']['mean'] = average(d[ef][eckey]['library_complexity']['after_alignment_PCR_duplicates_percentage'])
    # ref['library_complexity']['after']['sd'] = sd(d[ef][eckey]['library_complexity']['after_alignment_PCR_duplicates_percentage'])
    ref['peak_analysis'] = {}
    ref['peak_analysis']['reads_percentage_under_peaks'] = {}
    #ref['peak_analysis']['reads_percentage_under_peaks']['mean'] = average(d[ef][eckey]['peak_analysis']['reads_percentage_under_peaks'])
    #ref['peak_analysis']['reads_percentage_under_peaks']['sd'] = sd(d[ef][eckey]['peak_analysis']['reads_percentage_under_peaks'])
    ref['peak_analysis']['reads_percentage_under_peaks']['mean'] = 0.2
    ref['peak_analysis']['reads_percentage_under_peaks']['sd'] = 0.08

    # ref['peak_analysis']['reads_number_under_peaks'] = {}
    # ref['peak_analysis']['reads_number_under_peaks']['mean'] = average(d[ef][eckey]['peak_analysis']['reads_number_under_peaks'])
    # ref['peak_analysis']['reads_number_under_peaks']['sd'] = sd(d[ef][eckey]['peak_analysis']['reads_number_under_peaks'])
    # ref['peak_analysis']['peaks_number_in_promoter_regions'] = {}
    # ref['peak_analysis']['peaks_number_in_promoter_regions']['mean'] = average(d[ef][eckey]['peak_analysis']['peaks_number_in_promoter_regions'])
    # ref['peak_analysis']['peaks_number_in_promoter_regions']['sd'] = sd(d[ef][eckey]['peak_analysis']['peaks_number_in_promoter_regions'])
    # ref['peak_analysis']['peaks_number_in_non-promoter_regions'] = {}
    # ref['peak_analysis']['peaks_number_in_non-promoter_regions']['mean'] = average(d[ef][eckey]['peak_analysis']['peaks_number_in_non-promoter_regions'])
    # ref['peak_analysis']['peaks_number_in_non-promoter_regions']['sd'] = sd(d[ef][eckey]['peak_analysis']['peaks_number_in_non-promoter_regions'])
    ref['enrichment'] = {}
    ref['enrichment']['enrichment_score_in_coding_promoter_regions'] = {}
    #ref['enrichment']['enrichment_score_in_coding_promoter_regions']['mean'] = average(d[ef][eckey]['enrichment']['enrichment_score_in_coding_promoter_regions'])
    #ref['enrichment']['enrichment_score_in_coding_promoter_regions']['sd'] = sd(d[ef][eckey]['enrichment']['enrichment_score_in_coding_promoter_regions'])
    ref['enrichment']['enrichment_score_in_coding_promoter_regions']['mean'] = 11
    ref['enrichment']['enrichment_score_in_coding_promoter_regions']['sd'] = 4

    ref['enrichment']['subsampled_10M_enrichment_score'] = {}
    #ref['enrichment']['subsampled_10M_enrichment_score']['mean'] = average(d[ef][eckey]['enrichment']['subsampled_10M_enrichment_score'])
    #ref['enrichment']['subsampled_10M_enrichment_score']['sd'] = sd(d[ef][eckey]['enrichment']['subsampled_10M_enrichment_score'])
    ref['enrichment']['subsampled_10M_enrichment_score']['mean'] = 18
    ref['enrichment']['subsampled_10M_enrichment_score']['sd'] = 3

    ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'] = {}
    #ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']['mean'] = average(d[ef][eckey]['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'])
    #ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']['sd'] = sd(d[ef][eckey]['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'])
    ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']['mean'] = 0.1
    ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']['sd'] = 0.1

    results['ref'] = ref
    return results

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/report/<flist>')
def report(flist):
    return jsonify(format_text_report(flist))

@app.route('/rep', methods=['POST'])
def rep():
    fd = request.json
    return jsonify(format_text_report(','.join(fd['flist'])))

@app.route('/rep1', methods=['POST'])
def rep1():
    fd = request.json
    #print fd
    return jsonify(format_result(parse_json_list(fd['flist'], fd['labels'], fd['assays'])))

def main():
    pass

if __name__ == "__main__":
    main()
