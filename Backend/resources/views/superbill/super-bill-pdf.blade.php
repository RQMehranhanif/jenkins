@php
    if (isset($row)) {
        $patient_name = $row['patient_name'];
        $insurance = $row['insurance'];
        $dob = $row['dob'];
        $date_of_service = $row['date_of_service'];
        $doctor = $row['doctor'];
        $codes = $row['codes'];
    }
@endphp
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('css/fontawesome.css') }}">
    <link rel="stylesheet" href="{{ asset('css/fontawesome.min.css') }}">

    <title>Super Bill</title>

    <style>
        td{
            font-size: 13px
        }
        th{
            font-size: 13px
        }
    </style>
    
</head>

<body>
    <div class="container-fluid">
        <div class="mb-3" style="color: black; text-align:center">
            <b>
                <u>
                    ***PLEASE RETURN THIS TO THE RECEPTIONIST ON YOUR WAY OUT***
                </u>
            </b>
        </div>
           

        <div class="row mb-5">
            <div class="col-xs-6" style="padding-right:5px">
                

                {{-- <div class="row">
                    <div class="col-xs-3 text-center">
                        <h6 class="mb-0">ANNUAL WELLNESS VISIT</h6>
                    </div>
                    <div class="col-xs-3 text-center">
                        <h6 class="mb-0">ANNUAL MCR SCREENS</h6>
                    </div>
                </div> --}}

                <table style="width:100%; border:2px #000 solid; color:black">
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>{{@$patient_name ?? ""}}</td>
                      </tr>
                      <tr>
                        <th>DOB </th>
                        <td>{{@$insurance ?? ""}}</td>
                      </tr>
                      <tr>
                        <th>DOS</th>
                        <td> {{@$dob ?? ""}} </td>
                      </tr>
                      <tr>
                        <th>Insurance</th>
                        <td>{{@$date_of_service ?? ""}}</td>
                      </tr>
                      <tr>
                        <th>PCP</th>
                        <td>{{@$doctor ?? ""}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                <table style=" width:100%; border: 2px solid; color: black;">
                    <tbody>
                        <tr>
                            <th>Initial</th>
                            <th>Periodic</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>
                                99385
                                <input type="checkbox" name="99385" value="" @if(!empty(@$codes['99385'])) checked
                                    @endif />
                            </td>
                            <td>
                                99395
                                <input type="checkbox" name="99395" value="" @if(!empty(@$codes['99395'])) checked
                                    @endif />
                            </td>
                            <th></th>

                        </tr>
                        <tr style="border-bottom: 2px solid #000">
                            <td>
                                99386
                                <input type="checkbox" name="99386" value="" @if(!empty(@$codes['99386'])) checked
                                    @endif />
                            </td>
                            <td>
                                99396
                                <input type="checkbox" name="99396" value="" @if(!empty(@$codes['99396'])) checked
                                    @endif />
                            </td>
                            <th></th>

                        </tr>
                        <tr>
                            <td width="80%">Cardiovascular</td>
                            <td>G0446</td>
                            <td width="10%">
                                <input type="checkbox" name="G0446" value="" @if(!empty(@$codes['G0446'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Alcohol Scr</td>
                            <td>G0442</td>
                            <td width="10%">
                                <input type="checkbox" name="G0442" value="" @if(!empty(@$codes['G0442'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Advance Care</td>
                            <td>99497(33)</td>
                            <td width="10%">
                                <input type="checkbox" name="99497(33)" value="" @if(!empty(@$codes['99497(33)']))
                                    checked @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Depression Screen</td>
                            <td>G0444</td>
                            <td width="10%">
                                <input type="checkbox" name="G0444" value="" @if(!empty(@$codes['G0444'])) checked
                                    @endif />
                            </td>
                        </tr>

                        <tr>
                            <td width="80%">WELCOME TO MCR</td>
                            <td>G0402</td>
                            <td width="10%">
                                <input type="checkbox" name="G0402" value="" @if(!empty(@$codes['G0402'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">ANNUAL MCR: INITIAL</td>
                            <td>G0438</td>
                            <td width="10%">
                                <input type="checkbox" name="G0438" value="" @if(!empty(@$codes['G0438'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Subsequent</td>
                            <td>G0439</td>
                            <td width="10%">
                                <input type="checkbox" name="G0439" value="" @if(!empty(@$codes['G0439'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Humana PAF</td>
                            <td>99160</td>
                            <td width="10%">
                                <input type="checkbox" name="99160" value="" @if(!empty(@$codes['99160'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Comp Eval w/Exam (Humana)</td>
                            <td>99397</td>
                            <td width="10%">
                                <input type="checkbox" name="99397" value="" @if(!empty(@$codes['99397'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="80%">Humana AWV</td>
                            <td>96160</td>
                            <td width="10%">
                                <input type="checkbox" name="96160" value="" @if(!empty(@$codes['96160'])) checked
                                    @endif />
                            </td>
                        </tr>
                    </tbody>
                </table>
              
                <div class="row">
                    <div class="col-12 text-center">
                        <h6 class="mb-0">SMOKING CESSATION COUNSELING</h6>
                    </div>
                </div>
                <table style="width:100%; border: 2px solid; color: black;">
                    <tbody>
                        <tr>
                            <td width="50%"></td>
                            <td width="30%"> upto 10 MIN </td>
                            <td width="10%">99406</td>
                            <td width="10%">
                                <input type="checkbox" name="99406" value="" @if(!empty(@$codes['99406'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr>
                            <td width="50%"></td>
                            <td width="30%"> {'>'} 10 MIN </td>
                            <td width="10%">99407 </td>
                            <td width="10%">
                                <input type="checkbox" name="99407" value="" @if(!empty(@$codes['99407'])) checked
                                    @endif />
                            </td>
                        </tr>
                        <tr style="border-bottom: 2px solid; color: black;">
                            <td width="50%">LDCT Counseling</td>
                            <td width="30%"></td>
                            <td width="10%">G0296 </td>
                            <td width="10%">
                                <input type="checkbox" name="G0296" value="" @if(!empty(@$codes['G0296'])) checked
                                    @endif />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table style="width:100%; border:2px #000 solid; margin-top:4px">
                    <tr style="float: right">
                        <th rowspan=3 style="border: 2px solid;border-bottom: 2px solid;  color: black;"
                            class="text-center">
                            DM
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">A1c &lt; 7%</td>
                                        <td>3044F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3044F" value="" @if(!empty(@$codes['3044F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">A1c &gt; 9%</td>
                                        <td>3046F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3046F" value="" @if(!empty(@$codes['3046F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">A1c 7% - 8%</td>
                                        <td>3051F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3051F" value="" @if(!empty(@$codes['3051F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">A1c 8% - 9%</td>
                                        <td>3052F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3052F" value="" @if(!empty(@$codes['3052F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">In Office 7 field photos</td>
                                        <td>2024F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="2024F" value="" @if(!empty(@$codes['2024F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">No Retinopathy(2018 - 2019) </td>
                                        <td>3072F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3072F" value="" @if(!empty(@$codes['3072F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">Dilated Eye Exam (Report Viewed) </td>
                                        <td>2022F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="2022F" value="" @if(!empty(@$codes['2022F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Microalbumin(+ve)</td>
                                        <td>3060F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3060F" value="" @if(!empty(@$codes['3060F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">Microalbumin(-ve)</td>
                                        <td>3061F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3061F" value="" @if(!empty(@$codes['3061F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">CKD stage 4/5</td>
                                        <td>3066F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3066F" value="" @if(!empty(@$codes['3066F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">On ACE or ARB</td>
                                        <td>G8506</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8506" value="" @if(!empty(@$codes['G8506']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <th rowspan=1 style="border: 2px solid;border-bottom: 2px solid;  color: black;"
                            class="text-center">
                            ASCVD
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Aspirin or other Antiplatelet</td>
                                        <td>G8598</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8598" value="" @if(!empty(@$codes['G8598']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">Anticoagulants</td>
                                        <td>G9724</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9724" value="" @if(!empty(@$codes['G9724']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
 {{--
                    <tr>
                        <th rowspan=1 style="border: 2px solid; color: black;" class="text-center">
                            ASCVD Statin Therapy
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">
                                            LDL-C &gt; 190mg/dL, LDL-C 70-189 mg/dL (id DM) or
                                            ASCVD
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">On Statin/rcvd Rx for Statin</td>
                                        <td>G9664</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9664" value="" @if(!empty(@$codes['G9664']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">
                                            Intolerance or energy to statin or active liver
                                            disease
                                        </td>
                                        <td>G9781</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9781" value="" @if(!empty(@$codes['G9781']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr> --}}
            </table>

                
                <div class="row">
                    @if (isset($new_codes) && !empty($new_codes))
                        <div class="col-xs-6">
                            <table>
                                <tbody>
                                    <th  style="padding-right: 5px">CPT Codes :</th>
                                    @foreach ($new_codes as $code => $item)
                                            <td style="padding-left: 6px">{{$code}},</td>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                    
                  {{--   @if (isset($dxcodes) && !empty($dxcodes))
                        <div class="col-xs-6">
                            <table>
                                <tbody>
                                    <th>DX Codes</th>
                                    @foreach ($dxcodes as $code => $item)
                                        <tr>
                                            <td>{{$code}}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif --}}
                </div>

                <!-- Show NEWELY ADDED CPT CODES HERE -->

            </div>
            <div class="col-xs-6 mt-3" style="padding-left:0px">
                <table style="width:100%; border:2px #000 solid;">
                    BMI
                    <tr style="border: 2px solid">
                        <th style="border:2px #000 solid; color: black;" class="text-center">
                            BMl ( &gt; 18.5 and &lt; 25g/m2)
                        </th>
                        <td style="border: 2px solid; color: black;">
                            If you are below normal must have f/u plan
                        </td>
                        <td width="50%" style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td>Normal:</td>
                                        <td>G8420</td>
                                        <td>
                                            <input type="checkbox" name="G8420" value="" @if(!empty(@$codes['G8420']))
                                                checked @endif />
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>Above:</td>
                                        <td>G8417</td>
                                        <td>
                                            <input type="checkbox" name="G8417" value="" @if(!empty(@$codes['G8417']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Below:</td>
                                        <td>G8418</td>
                                        <td>
                                            <input type="checkbox" name="G8418" value="" @if(!empty(@$codes['G8418']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Refused:</td>
                                        <td>G8422</td>
                                        <td>
                                            <input type="checkbox" name="G8422" value="" @if(!empty(@$codes['G8422']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td></td>

                    </tr>

                    <!-- HTN -->
                    <tr style="border-bottom: 2px solid;">
                        <th rowspan=1 style="border: 2px solid; color: black;" class="text-center">
                            HTN
                        </th>
                        <td colspan=2 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td>Systolic Bp &lt; 140mm/Hg</td>
                                        <td>G8752</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8752" value="" @if(!empty(@$codes['G8752']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Daistolic Bp &lt; 90mm/Hg</td>
                                        <td>G8754</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8754" value="" @if(!empty(@$codes['G8754']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td></td>

                    </tr>

                    <!-- Tobacco -->
                    <tr>
                        <th rowspan=2 style="border: 2px solid;border-bottom: 2px solid;  color: black;"
                            class="text-center">
                            Tobacco
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Tobacco user and consulting given</td>
                                        <td>4004F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="4004F" value="" @if(!empty(@$codes['4004F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>

                    </tr>
                    <tr style="border-bottom: 2px solid;">
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Current Non-User</td>
                                        <td>1036F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="1036F" value="" @if(!empty(@$codes['1036F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Depression -->
                    <tr>
                        <th rowspan=1 style="border: 2px solid; color: black;" class="text-center">
                            Depression
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">PHQ-9 &lt; 9</td>
                                        <td>G8510</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8510" value="" @if(!empty(@$codes['G8510']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">PHQ-9 &gt; 9 w/f/u plan doc.</td>
                                        <td>G8431</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8431" value="" @if(!empty(@$codes['G8431']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">
                                            PHQ-9, Excep: Depression/Bipolar Disorder
                                        </td>
                                        <td>G9717</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9717" value="" @if(!empty(@$codes['G9717']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Fall Screening -->
                    <tr>
                        <th rowspan=1 style="border: 2px solid;border-bottom: 2px solid;  color: black;"
                            class="text-center">
                            Fall Screening
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">
                                            2+ falls or any fall w/injury(Mark both)
                                        </td>
                                        <td>1100F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="1100F" value="" @if(!empty(@$codes['1100F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">
                                            Assess w/in 12mo of documented fall
                                        </td>
                                        <td>3288F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3288F" value="" @if(!empty(@$codes['3288F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">PNo falls or 1 fall w/out injury</td>
                                        <td>1101F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="1101F" value="" @if(!empty(@$codes['1101F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>


                    <!-- Vaccines -->
                    <tr style="border-bottom: 2px solid;">
                        <th rowspan=3 style="border: 2px solid; color: black;" class="text-center">
                            Vaccines
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <th>Pneumo revd</th>
                                    </tr>
                                    <tr>
                                        <td width="71%">
                                            Document year rcvd and type if known
                                        </td>
                                        <td>4040</td>
                                        <td>
                                            <input type="checkbox" name="4040" value="" @if(!empty(@$codes['4040']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Flu Vaccine</td>
                                        <td>G8482</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G8482" value="" @if(!empty(@$codes['G8482']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="border-bottom: 2px solid;">
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tr>
                                    <th>Flu Not Eligible:</th>
                                </tr>
                                <tr>
                                    <td width="70%">
                                        Pt. refuses, allergy, vaccine not available
                                    </td>
                                    <td>G8483</td>
                                    <td width="10%">
                                        <input type="checkbox" name="G8483" value="" @if(!empty(@$codes['G8483']))
                                            checked @endif />
                                    </td>
                                </tr>
                                <tbody></tbody>
                            </table>
                        </td>
                    </tr>


                    <!-- CA Screening -->
                    <tr>
                        <th rowspan=2 style="border: 2px solid;border-bottom: 2px solid;  color: black;"
                            class="text-center">
                            CA Screening
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Colo CA Screening (Report Viewed)</td>
                                        <td>3017F</td>
                                        <td width="10%">
                                            <input type="checkbox" name="3017F" value="" @if(!empty(@$codes['3017F']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">Hx of colectomy or Colon CA</td>
                                        <td>G9711</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9711" value="" @if(!empty(@$codes['G9711']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">Mammo Docu. In last 27 mo.</td>
                                        <td>G9899</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9899" value="" @if(!empty(@$codes['G9899']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">Hx of bi/unilateral mastectomy</td>
                                        <td>G9708</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9708" value="" @if(!empty(@$codes['G9708']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <th rowspan=1 style="border: 2px solid; color: black;" class="text-center">
                            ASCVD Statin Therapy
                        </th>
                        <td colspan=3 style="border: 2px solid; color: black;">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td width="70%">
                                            LDL-C &gt; 190mg/dL, LDL-C 70-189 mg/dL (id DM) or
                                            ASCVD
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">On Statin/rcvd Rx for Statin</td>
                                        <td>G9664</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9664" value="" @if(!empty(@$codes['G9664']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="70%">
                                            Intolerance or energy to statin or active liver
                                            disease
                                        </td>
                                        <td>G9781</td>
                                        <td width="10%">
                                            <input type="checkbox" name="G9781" value="" @if(!empty(@$codes['G9781']))
                                                checked @endif />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>
                <div class="row">
                   
                    
                  @if (isset($dxcodes) && !empty($dxcodes))
                        <div class="col-xs-6">
                            <table>
                                <tbody>
                                    <th>DX Codes :</th>
                                    @foreach ($dxcodes as $code => $item)
                                    <td style="padding-left: 6px">{{$code}},</td>

                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                </div>
        </div>
    </div>

               {{-- DM --}}
               <br />
               <br />

     <div class="row">
    
           
            <div class="col-xs-6">
                <label>Next Followup:</label>
                <u>
                    <span>
                        _______________________________
                    </span>
                </u>
            </div>
            
            <div class="col-xs-6">
                <label>
                    Provider Signature:
                </label>
                <u>
                    <span>
                        ________________________________
                    </span>
                </u>
            </div>
   
        </div>

    </div>
</body>

</html>