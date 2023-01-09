<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Questionaires;
use App\Models\SuperBillCodes;
use PDF;

class SuperBillCodesController extends Controller
{
    protected $view = "superbill.";

    public function index(Request $request,$id){
        try {
            $row = Questionaires::with('superBill','patient.insurance','patient.doctor')->where('id',$id)->first()->toArray();
            $list = [
                'patient_name' => $row['patient']['name'] ?? '',
                'dob' => $row['patient']['dob'] ?? '',
                'date_of_service' => $row['date_of_service'] ?? '',
                'insurance' => $row['patient']['insurance']['name'] ?? '',
                'doctor' => $row['patient']['doctor']['name'] ?? ''
            ];
            $codes = $row['super_bill']['codes'] ?? [];
            $codes = !empty($codes)?json_decode($codes,true):[];
            $newCodes = $codes['new_codes'] ?? [];
            $dxCodes = $codes['dx_codes'] ?? [];
            if(isset($codes['dx_codes'])) unset($codes['dx_codes']);

            if(isset($codes['new_codes'])) unset($codes['new_codes']);
            foreach ($codes as $key => $value) {
                $codes[$key] = $value=='true'?true:false;
            }

            // New Codes
            $newCodes = !empty($newCodes)?json_decode($newCodes,true):[];
            foreach ($newCodes as $key => $value) {
                $newCodes[$key] = $value=='true'?true:false;
            }
            // Dx Codes
            $dxCodes = !empty($dxCodes)?json_decode($dxCodes,true):[];
            foreach ($dxCodes as $key => $value) {
                $dxCodes[$key] = $value=='true'?true:false;
            }
            $list['codes'] = $codes;
            $list['new_codes'] = $newCodes;
            $list['dxcodes'] = $dxCodes;
            $response = array('success'=>true,'message'=>'Data Retrived','data'=>$list);
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }
        return response()->json($response);
    }

    public function store(Request $request){
        try {
            $questionId = $request->get('question_id');
            $isDxcode =  $request->get('dx_codes') ?? '';
            $code = $request->get('code');
            $query = SuperBillCodes::where('question_id',$questionId)->first();
            $codes = !empty($query)?json_decode($query['codes'],true):[];    
            if(!empty($isDxcode)){
                $newCodes =!empty($codes['dx_codes'])?json_decode($codes['dx_codes'],true):[];
                $newCodes[$isDxcode] = "true";
                $codes['dx_codes'] = json_encode($newCodes);
            }else{
                $newCodes =!empty($codes['new_codes'])?json_decode($codes['new_codes'],true):[];
                $newCodes[$code] = "true";
                $codes['new_codes'] = json_encode($newCodes);
            }
            
            SuperBillCodes::where('question_id',$questionId)->update(['codes'=>json_encode($codes)]);
            if(!empty($isDxcode)){
                $response = array('success'=>true,'message'=>'Dx Code Added Successfully','data'=>$isDxcode);
            }else{
                $response = array('success'=>true,'message'=>'Code Added Successfully','data'=>$code);
            }
        } catch (\Exception $e) {
          $response = array('success'=>false,'message'=>$e->getMessage());   
        }
        return response()->json($response);
    }

    public function update(Request $request){
        try {
            $input = $request->all();
            $query = SuperBillCodes::where('question_id',$input['question_id'])->first();
            $codes = !empty($query)?json_decode($query['codes'],true):[];
            $code = str_replace('"', "", $input['code']);
            $codes[$code] = (string)$input['status'];
            SuperBillCodes::where('question_id',$input['question_id'])->update(['codes'=>json_encode($codes)]);
            $response = array('success'=>true,'message'=>'Code Updated Successfully');
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());      
        }
        return response()->json($response);
    }

    public function destroy(Request $request)
    {
        try {
            $questionId = $request->get('question_id');
            $code = $request->get('code');
            $code = str_replace('"', "", $code);
            $query = SuperBillCodes::where('question_id',$questionId)->first();
            $codes = !empty($query)?json_decode($query['codes'],true):[];
            $newCodes =!empty($codes['new_codes'])?json_decode($codes['new_codes'],true):[];
            if (isset($newCodes[$code])) {
                unset($newCodes[$code]);
            }
            $codes['new_codes'] = json_encode($newCodes);
            SuperBillCodes::where('question_id',$questionId)->update(['codes'=>json_encode($codes)]);
            $response = array('success'=>true,'message'=>'Code Deleted Successfully','data'=>json_decode($codes['new_codes'], true));

        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());      
        }
        return response()->json($response);
    }

    public function destroy_dx(Request $request)
    {
        try {
            $questionId = $request->get('question_id');
            $code = $request->get('dx_codes');
            $code = str_replace('"', "", $code);
            $query = SuperBillCodes::where('question_id',$questionId)->first();           
            $codes = !empty($query)?json_decode($query['codes'],true):[];
            $newCodes =!empty($codes['dx_codes'])?json_decode($codes['dx_codes'],true):[];
            
            if (isset($newCodes[$code])) {
                unset($newCodes[$code]);
            }
            
            $codes['dx_codes'] = json_encode($newCodes);  
            SuperBillCodes::where('question_id',$questionId)->update(['codes'=>json_encode($codes)]);
            
            $response = array('success'=>true,'message'=>'Dx Code Deleted Successfully','data'=>json_decode($codes['dx_codes'], true));
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());      
        }
        return response()->json($response);
    }

    /* Downloadsuperbill pdf */
    public function downloadSuperBill(Request $request, $id)
    {
        $data = $this->index($request, $id)->getData();
        $superBillData = [];
        foreach ($data->data as $key => $value) {
            if ($key == "codes") {
                $superBillData[$key] = json_decode(json_encode($value), true);
            } else {
                $superBillData[$key] = $value;
            }
        }
        return $superBillData;
        ini_set('max_execution_time', 120);
        $pdf = PDF::loadView($this->view.'super-bill-pdf',$superBillData);
        $headers = array(
            'Content-Type: application/pdf',
        );
        return $pdf->download('super-bill-pdf.pdf', $headers);
    }

    /* Checking HTML of super bill */
    public function superbillHtml(Request $request, $id)
    {
        $data = $this->index($request, $id)->getData();
        $superBillData = [];
        foreach ($data->data as $key => $value) {
            if ($key == "codes") {
                $superBillData[$key] = json_decode(json_encode($value), true);
            } else {
                $superBillData[$key] = $value;
            }
        }
        // dd($superBillData);
        return view($this->view.'super-bill-pdf', $superBillData);
    }
}