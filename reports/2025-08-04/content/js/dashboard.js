/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.66666666666667, "KoPercent": 3.3333333333333335};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7714285714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://www.amazon.in/Lenovo-inches-27-94-128GB-Wi-Fi/dp/B09DYD3D1C/ref=sr_1_1?dd=L45E1VCYK7HNMtdM3Eg4qQ%2C%2C&dib=eyJ2IjoiMSJ9.DP85JMCpGEp0pI9oczr37IDmRQh0vX9emoFECWyu4Nepzx_EkcZauX9Rfn2eEpeQyIsvYVMnjQJrUNZ2bxctjoFShTsvyWxv754sxhSTsT53joAQJb5W4o4AexLTdtthiO9yowxKYuBo69POaaOSgrMX6BTMAmKA-Q7JSxUbvK5IZQm46O_QOrouHzKEcbxY.xqI666ick3ZWknvxe19ghrLyNziAszYKQInVi1cRiSU&dib_tag=se&keywords=laptops&qid=1751980035&refinements=p_90%3A6741118031%2Cp_123%3A391242%2Cp_n_pct-off-with-tax%3A2665401031&rnid=2665398031&s=computers&sr=1-1"], "isController": false}, {"data": [0.0, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://www.amazon.in/checkout/entry/cart?tangoWeblabStatus=tango_enable_unrec_customer&pipelineType=Chewbacca&referrer=cart&ref_=ox_sw_proceed&isEligibilityLogicDisabled=1&proceedToCheckout=1&oldCustomerId=0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.amazon.in/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?siteState=isRegularCheckout.1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.amazon.in/gp/cart/view.html?ref_=nav_cart"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amazon.in/s/ref=nb_sb_noss_2?url=search-alias%3Dkitchen&field-keywords=laptops&crid=2J02LCQT3SXKR&sprefix=laptops%2Ckitchen%2C266"], "isController": false}, {"data": [0.5, 500, 1500, "Go back"], "isController": true}, {"data": [0.0, 500, 1500, "filters"], "isController": true}, {"data": [1.0, 500, 1500, "https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980036564&s=AXGvtlVuuJFW2J1klt22SC8J16I26BXSjb4QF_bljXPV&gdpr_consent=&gdpr_consent_avl=&cb=1751980036564"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amazon.in/cart/add-to-cart/ref=dp_start-bbf_1_glance"], "isController": false}, {"data": [1.0, 500, 1500, "https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751979989963&s=AWnafigVpPSNDZYZ-_UxMlK6_5pz5e_SnjIqVr3W2cwF&gdpr_consent=&gdpr_consent_avl=&cb=1751979989963"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amazon.in/s?k=laptops&rh=n%3A976392031%2Cp_90%3A6741118031%2Cp_123%3A391242&dc&qid=1751980004&rnid=91049095031&ref=sr_nr_p_123_1&ds=v1%3AMwq7TVqkNCYd2%2FdFuENV8TRt9u%2BTncFhOmWpqNKDSw0"], "isController": false}, {"data": [1.0, 500, 1500, "https://images-eu.ssl-images-amazon.com/images/S/apesafeframe/ape/sf/desktop/sf-1.50.f5f4de2b.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980013508&s=Acnx-1Koh4jjXbQUO-GWO2Swlj7pHBQgY-OurQvdCLrj&gdpr_consent=&gdpr_consent_avl=&cb=1751980013508"], "isController": false}, {"data": [0.0, 500, 1500, "search"], "isController": true}, {"data": [1.0, 500, 1500, "https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980074502&s=AdArRuhrWCKOWyCKZtNIpN6kiukDJ0DS53opAPuS3SIw&gdpr_consent=&gdpr_consent_avl=&cb=1751980074502"], "isController": false}, {"data": [1.0, 500, 1500, "https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980059744&s=Af0F35DLvea0ePZgAnTg-q0bz47J15Z02CPonzImAvQG&gdpr_consent=&gdpr_consent_avl=&cb=1751980059744"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amazon.in/s?k=laptops&i=computers&rh=n%3A976392031%2Cp_90%3A6741118031%2Cp_123%3A391242%2Cp_n_pct-off-with-tax%3A2665401031&dc&qid=1751980012&rnid=2665398031&ref=sr_nr_p_n_pct-off-with-tax_4&ds=v1%3AN1VKHrXoHv%2F3lLuyY5nYPP5snSO8n22iQQnQeMYjim4"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.amazon.in/s?k=laptops&i=aps"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.amazon.in/checkout/entry/cart?tangoWeblabStatus=tango_enable_unrec_customer&pipelineType=Chewbacca&referrer=cart&ref_=ox_sw_proceed&isEligibilityLogicDisabled=1&proceedToCheckout=1&oldCustomerId=0-1"], "isController": false}, {"data": [0.5, 500, 1500, "proceed to buy"], "isController": true}, {"data": [1.0, 500, 1500, "https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980142812&s=AZuF5UW9mSE--7tp1pWW9ulrQTX-JwTAN3GEng6Xl74Z&gdpr_consent=&gdpr_consent_avl=&cb=1751980142812"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.amazon.in/checkout/entry/cart?tangoWeblabStatus=tango_enable_unrec_customer&pipelineType=Chewbacca&referrer=cart&ref_=ox_sw_proceed&isEligibilityLogicDisabled=1&proceedToCheckout=1&oldCustomerId=0-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 1, 3.3333333333333335, 333.6666666666666, 5, 2308, 131.0, 1155.6000000000004, 1801.9999999999993, 2308.0, 0.22402437385187507, 45.56276556222651, 0.21587140347536482], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.amazon.in/Lenovo-inches-27-94-128GB-Wi-Fi/dp/B09DYD3D1C/ref=sr_1_1?dd=L45E1VCYK7HNMtdM3Eg4qQ%2C%2C&dib=eyJ2IjoiMSJ9.DP85JMCpGEp0pI9oczr37IDmRQh0vX9emoFECWyu4Nepzx_EkcZauX9Rfn2eEpeQyIsvYVMnjQJrUNZ2bxctjoFShTsvyWxv754sxhSTsT53joAQJb5W4o4AexLTdtthiO9yowxKYuBo69POaaOSgrMX6BTMAmKA-Q7JSxUbvK5IZQm46O_QOrouHzKEcbxY.xqI666ick3ZWknvxe19ghrLyNziAszYKQInVi1cRiSU&dib_tag=se&keywords=laptops&qid=1751980035&refinements=p_90%3A6741118031%2Cp_123%3A391242%2Cp_n_pct-off-with-tax%3A2665401031&rnid=2665398031&s=computers&sr=1-1", 1, 0, 0.0, 2308.0, 2308, 2308, 2308.0, 2308.0, 2308.0, 2308.0, 0.4332755632582322, 823.3479676668112, 0.7146508069757366], "isController": false}, {"data": ["add to cart", 1, 1, 100.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 6.209603296963946, 6.66360294117647], "isController": true}, {"data": ["https://www.amazon.in/checkout/entry/cart?tangoWeblabStatus=tango_enable_unrec_customer&pipelineType=Chewbacca&referrer=cart&ref_=ox_sw_proceed&isEligibilityLogicDisabled=1&proceedToCheckout=1&oldCustomerId=0", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 692.26805515553, 7.130706365207374], "isController": false}, {"data": ["https://www.amazon.in/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?siteState=isRegularCheckout.1", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 9.449678308823529, 3.1163832720588234], "isController": false}, {"data": ["https://www.amazon.in/gp/cart/view.html?ref_=nav_cart", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 625.8157443317423, 2.8364595763723153], "isController": false}, {"data": ["https://www.amazon.in/s/ref=nb_sb_noss_2?url=search-alias%3Dkitchen&field-keywords=laptops&crid=2J02LCQT3SXKR&sprefix=laptops%2Ckitchen%2C266", 1, 0, 0.0, 1170.0, 1170, 1170, 1170.0, 1170.0, 1170.0, 1170.0, 0.8547008547008547, 235.3064903846154, 0.671073717948718], "isController": false}, {"data": ["Go back", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 411.5736432210031, 2.9832606778996866], "isController": true}, {"data": ["filters", 1, 0, 0.0, 4557.0, 4557, 4557, 4557.0, 4557.0, 4557.0, 4557.0, 0.21944261575597981, 810.5620902594908, 2.676171274961597], "isController": true}, {"data": ["https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980036564&s=AXGvtlVuuJFW2J1klt22SC8J16I26BXSjb4QF_bljXPV&gdpr_consent=&gdpr_consent_avl=&cb=1751980036564", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 4.895833333333334, 9.53125], "isController": false}, {"data": ["https://www.amazon.in/cart/add-to-cart/ref=dp_start-bbf_1_glance", 1, 1, 100.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 9.49435763888889, 9.140114379084968], "isController": false}, {"data": ["https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751979989963&s=AWnafigVpPSNDZYZ-_UxMlK6_5pz5e_SnjIqVr3W2cwF&gdpr_consent=&gdpr_consent_avl=&cb=1751979989963", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.228051839464883, 2.390781772575251], "isController": false}, {"data": ["https://www.amazon.in/s?k=laptops&rh=n%3A976392031%2Cp_90%3A6741118031%2Cp_123%3A391242&dc&qid=1751980004&rnid=91049095031&ref=sr_nr_p_123_1&ds=v1%3AMwq7TVqkNCYd2%2FdFuENV8TRt9u%2BTncFhOmWpqNKDSw0", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 937.783640960039, 0.9451525950292398], "isController": false}, {"data": ["https://images-eu.ssl-images-amazon.com/images/S/apesafeframe/ape/sf/desktop/sf-1.50.f5f4de2b.html", 13, 0, 0.0, 22.3076923076923, 5, 212, 7.0, 130.39999999999992, 212.0, 212.0, 0.2522655385869249, 0.48747586497972173, 0.1515450354627132], "isController": false}, {"data": ["https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980013508&s=Acnx-1Koh4jjXbQUO-GWO2Swlj7pHBQgY-OurQvdCLrj&gdpr_consent=&gdpr_consent_avl=&cb=1751980013508", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 4.831414473684211, 9.405838815789474], "isController": false}, {"data": ["search", 1, 0, 0.0, 3081.0, 3081, 3081, 3081.0, 3081.0, 3081.0, 3081.0, 0.32456994482310936, 499.1245486449205, 1.3141279211295034], "isController": true}, {"data": ["https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980074502&s=AdArRuhrWCKOWyCKZtNIpN6kiukDJ0DS53opAPuS3SIw&gdpr_consent=&gdpr_consent_avl=&cb=1751980074502", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.6614819004524888, 3.234587104072398], "isController": false}, {"data": ["https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980059744&s=Af0F35DLvea0ePZgAnTg-q0bz47J15Z02CPonzImAvQG&gdpr_consent=&gdpr_consent_avl=&cb=1751980059744", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 4.831414473684211, 9.405838815789474], "isController": false}, {"data": ["https://www.amazon.in/s?k=laptops&i=computers&rh=n%3A976392031%2Cp_90%3A6741118031%2Cp_123%3A391242%2Cp_n_pct-off-with-tax%3A2665401031&dc&qid=1751980012&rnid=2665398031&ref=sr_nr_p_n_pct-off-with-tax_4&ds=v1%3AN1VKHrXoHv%2F3lLuyY5nYPP5snSO8n22iQQnQeMYjim4", 1, 0, 0.0, 930.0, 930, 930, 930.0, 930.0, 930.0, 930.0, 1.075268817204301, 872.1973706317203, 1.4910954301075268], "isController": false}, {"data": ["https://www.amazon.in/s?k=laptops&i=aps", 1, 0, 0.0, 1388.0, 1388, 1388, 1388.0, 1388.0, 1388.0, 1388.0, 0.7204610951008645, 904.9272784582133, 0.5649709564121038], "isController": false}, {"data": ["https://www.amazon.in/checkout/entry/cart?tangoWeblabStatus=tango_enable_unrec_customer&pipelineType=Chewbacca&referrer=cart&ref_=ox_sw_proceed&isEligibilityLogicDisabled=1&proceedToCheckout=1&oldCustomerId=0-1", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1209.3718370445345, 7.104788714574899], "isController": false}, {"data": ["proceed to buy", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 392.32199814276487, 5.367308624031008], "isController": true}, {"data": ["https://aax-eu.amazon-adsystem.com/s/iu3?d=amazon.in&slot=navFooter&a2=0101fd34016f8935e968e197bbf3c5935bac5562da9afd833a1e115e6e234caba0c1&old_oo=0&ts=1751980142812&s=AZuF5UW9mSE--7tp1pWW9ulrQTX-JwTAN3GEng6Xl74Z&gdpr_consent=&gdpr_consent_avl=&cb=1751980142812", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.6766552511415524, 3.264126712328767], "isController": false}, {"data": ["https://www.amazon.in/checkout/entry/cart?tangoWeblabStatus=tango_enable_unrec_customer&pipelineType=Chewbacca&referrer=cart&ref_=ox_sw_proceed&isEligibilityLogicDisabled=1&proceedToCheckout=1&oldCustomerId=0-0", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 9.298345094086022, 7.203461021505376], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 1, 100.0, 3.3333333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amazon.in/cart/add-to-cart/ref=dp_start-bbf_1_glance", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
