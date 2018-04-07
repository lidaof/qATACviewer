import sys,os,json,math,urllib2
from flask import Flask, request
from flask import jsonify
app = Flask(__name__)

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

section1 = ['total_reads','mapped_reads','uniquely_mapped_reads','non-redundant_mapped_reads','useful_reads']
section2 = ['percentage_of_uniquely_mapped_reads_in_chrM','percentage_of_non-redundant_uniquely_mapped_reads_in_chrX','percentage_of_non-redundant_uniquely_mapped_reads_in_chrY','Percentage_of_non-redundant_uniquely_mapped_reads_in_autosome']
section3 = ['before_alignment_library_duplicates_percentage','after_alignment_PCR_duplicates_percentage']
section4 = ['enrichment_ratio_in_coding_promoter_regions', 'subsampled_10M_enrichment_ratio', 'percentage_of_background_RPKM_larger_than_0.3777']
section5 = ['reads_number_under_peaks', 'peaks_number_in_promoter_regions','peaks_number_in_non-promoter_regions', 'reads_percentage_under_peaks']
section6 = ['insertion_size','density']
section7 = ['peak_length','density']
section8 = ['total_reads','expected_distinction','lower_0.95_confidnece_interval','upper_0.95_confidnece_interval']
section9 = ['sequence_depth','peaks_number','percentage_of_peaks_recaptured']

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

def parse_json_list(flist):
    d = {} # key: filename, value: parsed json content, put key error if there is something wrong loading json content, value would a list of file or URLs failed loading json
    d['error'] = []
    for f in flist:
        #print f
        #label = f
        label = f.split('/')[-1].split('_')[0]
        #label = f.split('_')[1]
        content = ''
        if f.startswith('http'):
            try:
                content = json.load(urllib2.urlopen(f))
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
        if len(d['error']) == 0: # means json loaded correctly
            new_content = json.loads(json.dumps(content), object_hook=remove_spaces)
            d[label] = new_content
            #print content
            #print new_content
    return d

def reformat_array(lst, key1, key2):
    '''
    reformat the array for used by recharts directly, lst is the data, key1 is x-axis, and key2 is y-axis
    '''
    results = [] # each elmemnt is {name: insert_size, file1: frequency1, file2: freq2, ...}
    results_keys = {} # key: insert size, value: {filenames: frequencys}
    for k in lst:
        for idx,j in enumerate(k[key1]):
            if j not in results_keys:
                results_keys[j] = {k['name']: k[key2][idx]}
            else:
                results_keys[j][k['name']] = k[key2][idx]
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
    results = {}
    results['error'] = d['error']
    ef = '' # encode f, make sure encode ref came from correct json
    for h in headers:
        results[h] = []
        for f in d:
            if f == 'error': 
                #results['error'].extend(d[f])
                continue
            tmp = {}
            tmp['name'] = f
            for k in headers[h]:
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
    results['insert_distribution'] = reformat_array(results['insertion_size_distribution'],'insertion_size','density')
    #peak size
    results['peak_distribution'] = reformat_array(results['peak_length_distribution'], 'peak_length','density')
    #yield
    results['yield_distro'] = reformat_array(results['yield_distribution'], 'total_reads', 'expected_distinction')
    results['yield_distro_lower'] = reformat_array(results['yield_distribution'], 'total_reads', 'lower_0.95_confidnece_interval')
    results['yield_distro_upper'] = reformat_array(results['yield_distribution'], 'total_reads', 'upper_0.95_confidnece_interval')
    # saturation
    results['saturation_peaks'] = reformat_array(results['saturation'],'sequence_depth','peaks_number')
    results['saturation_peaks_pct'] = reformat_array(results['saturation'],'sequence_depth','percentage_of_peaks_recaptured')
    # encode ref standard
    if not ef: return results # encode ref cannot be read
    ref = {}
    #refernce...what's the f...
    ref['mapping'] = {}
    ref['mapping']['total'] = {}
    ref['mapping']['total']['mean'] = average(d[ef]['ENCODE_PE_refernce']['mapping_stats']['total_reads'])
    ref['mapping']['total']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['mapping_stats']['total_reads'])
    ref['mapping']['mapped'] = {}
    ref['mapping']['mapped']['mean'] = average(d[ef]['ENCODE_PE_refernce']['mapping_stats']['mapped_reads'])
    ref['mapping']['mapped']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['mapping_stats']['mapped_reads'])
    ref['mapping']['unimap'] = {}
    ref['mapping']['unimap']['mean'] = average(d[ef]['ENCODE_PE_refernce']['mapping_stats']['uniquely_mapped_reads'])
    ref['mapping']['unimap']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['mapping_stats']['uniquely_mapped_reads'])
    ref['mapping']['nonredant'] = {}
    ref['mapping']['nonredant']['mean'] = average(d[ef]['ENCODE_PE_refernce']['mapping_stats']['non-redundant_mapped_reads'])
    ref['mapping']['nonredant']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['mapping_stats']['non-redundant_mapped_reads'])
    ref['mapping']['useful'] = {}
    ref['mapping']['useful']['mean'] = average(d[ef]['ENCODE_PE_refernce']['mapping_stats']['useful_reads'])
    ref['mapping']['useful']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['mapping_stats']['useful_reads'])
    ref['library_complexity'] = {}
    ref['library_complexity']['after'] = {}
    ref['library_complexity']['after']['mean'] = average(d[ef]['ENCODE_PE_refernce']['library_complexity']['after_alignment_PCR_duplicates_percentage'])
    ref['library_complexity']['after']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['library_complexity']['after_alignment_PCR_duplicates_percentage'])
    ref['peak_analysis'] = {}
    ref['peak_analysis']['reads_percentage_under_peaks'] = {}
    ref['peak_analysis']['reads_percentage_under_peaks']['mean'] = average(d[ef]['ENCODE_PE_refernce']['peak_analysis']['reads_percentage_under_peaks'])
    ref['peak_analysis']['reads_percentage_under_peaks']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['peak_analysis']['reads_percentage_under_peaks'])
    ref['peak_analysis']['reads_number_under_peaks'] = {}
    ref['peak_analysis']['reads_number_under_peaks']['mean'] = average(d[ef]['ENCODE_PE_refernce']['peak_analysis']['reads_number_under_peaks'])
    ref['peak_analysis']['reads_number_under_peaks']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['peak_analysis']['reads_number_under_peaks'])
    ref['peak_analysis']['peaks_number_in_promoter_regions'] = {}
    ref['peak_analysis']['peaks_number_in_promoter_regions']['mean'] = average(d[ef]['ENCODE_PE_refernce']['peak_analysis']['peaks_number_in_promoter_regions'])
    ref['peak_analysis']['peaks_number_in_promoter_regions']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['peak_analysis']['peaks_number_in_promoter_regions'])
    ref['peak_analysis']['peaks_number_in_non-promoter_regions'] = {}
    ref['peak_analysis']['peaks_number_in_non-promoter_regions']['mean'] = average(d[ef]['ENCODE_PE_refernce']['peak_analysis']['peaks_number_in_non-promoter_regions'])
    ref['peak_analysis']['peaks_number_in_non-promoter_regions']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['peak_analysis']['peaks_number_in_non-promoter_regions'])
    ref['enrichment'] = {}
    ref['enrichment']['enrichment_ratio_in_coding_promoter_regions'] = {}
    ref['enrichment']['enrichment_ratio_in_coding_promoter_regions']['mean'] = average(d[ef]['ENCODE_PE_refernce']['enrichment']['enrichment_ratio_in_coding_promoter_regions'])
    ref['enrichment']['enrichment_ratio_in_coding_promoter_regions']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['enrichment']['enrichment_ratio_in_coding_promoter_regions'])
    ref['enrichment']['subsampled_10M_enrichment_ratio'] = {}
    ref['enrichment']['subsampled_10M_enrichment_ratio']['mean'] = average(d[ef]['ENCODE_PE_refernce']['enrichment']['subsampled_10M_enrichment_ratio'])
    ref['enrichment']['subsampled_10M_enrichment_ratio']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['enrichment']['subsampled_10M_enrichment_ratio'])
    ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'] = {}
    ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']['mean'] = average(d[ef]['ENCODE_PE_refernce']['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'])
    ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777']['sd'] = sd(d[ef]['ENCODE_PE_refernce']['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'])
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
    return jsonify(format_result(parse_json_list(fd['flist'])))

def main():
    pass

if __name__ == "__main__":
    main()
