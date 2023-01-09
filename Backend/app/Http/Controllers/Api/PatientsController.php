<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
//use App\Http\Resources\PatientCollection;
use Illuminate\Http\Request;
use App\Models\Patients;
use App\Models\Diagnosis;
use App\Models\SurgicalHistory;
use App\Models\User;
use App\Models\Questionaires;
use App\Models\Insurances;
use App\Models\Medications;
use App\Models\Clinic;
use App\Models\ClinicUser;
use Auth, Validator, DB;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;

class PatientsController extends Controller
{
    protected $per_page = '';

    public function __construct(){
	    $this->per_page = Config('constants.perpage_showdata');
	}

    public function index(Request $request)
    {
        try {

            $doctor_id = $request->input("doctor_id") ?? '';
            $patient_id = $request->input("patient_id") ?? '';
            $clinic_id = $request->input("clinic_id") ?? '';
            $insurance_id = $request->input("insurance_id") ?? '';

            $group_b = $request->input("group_b") ?? '';
            $totalPopulation = $request->input("totalPopulation") ?? '';

            $active = $request->input("active") ?? 1;             
            $query = Patients::with('insurance', 'doctor', 'questionServey','diagnosis','medication','surgical_history');


            if (!empty($totalPopulation)) {
                $query = $query->where('deleted_at', '=', Null);
            }
            
            if (!empty($group_b)) {
                $query = $query->whereColumn('address','!=','change_address')->orWhereColumn('doctor_id','!=','change_doctor_id')->orWhereNotNull('dod');
            }

            if(!empty($doctor_id)){
                $query->where('doctor_id',$doctor_id);
            }

            if(!empty($insurance_id)){
                $query->where('insurance_id',$insurance_id);
            }

            if(!empty($clinic_id)){
                $query->where('clinic_id',$clinic_id);
            }

            if(!empty($patient_id)){
                $query->where('patient_id',$patient_id);
            }

            if ($active == 2) {
                $query = $query->onlyTrashed();
            }

            $result = $query->orderBy('id', 'DESC')->get();

            /*start*/
            if ($request->has('search') && !empty($request->input('search'))) {
                $search = $request->get('search');
                $query = $query->where('first_name', 'like', '%' . $search . '%');
            }

            $query = $query->paginate($this->per_page);
            $total = $query->total();
            $current_page = $query->currentPage();
            $result = $query->toArray();

            $clinicList = Clinic::select('id', 'name')->get()->toArray();

            // return response()->json($clinicList);

            $list = [];
            foreach ($result['data'] as $key => $val) {
                $list[] = [
                    'id' => $val['id'],
                    'first_name' => $val['first_name'],
                    'mid_name' => $val['mid_name'],
                    'last_name' => $val['last_name'],
                    'identity' => $val['identity'],
                    'name' => $val['name'],
                    'contact_no' => $val['contact_no'],
                    'doctor_id' => @$val['doctor_id'],
                    'doctor_name' =>  @$val['doctor']['name'],
                    'insurance_id' => @$val['insurance_id'],
                    'insurance_name' =>  @$val['insurance']['name'],
                    'age' => $val['age'],
                    'gender' => $val['gender'],
                    'address' => $val['address'],
                    'address_2' => $val['address_2'],
                    'dob' => $val['dob'],
                    'cell' => $val['cell'],
                    'email' => $val['email'],
                    'city' => $val['city'],
                    'state' => $val['state'],
                    'zipCode' => $val['zipCode'],
                    'diagnosis' => $val['diagnosis'],
                    'medication' => $val['medication'],
                    'surgical_history' => $val['surgical_history'],
                    'family_history' => json_decode($val['family_history'],true),
                ];
            }
           

            $insurances = Insurances::all();
            $insuranceList = [];
            foreach ($insurances as $key => $value) {
                $insuranceList[$value->id] = $value->name;
            }

            $doctor123 = User::where("role" ,21)->get()->toArray();
            $doctorList = [];
            foreach ($doctor123 as $key => $value) {
                $doctorList[] = ['id' => $value['id'], 'name'=> $value['name']];
            }

            $response = [
                'success' => true,
                'message' => 'Patients Data Retrived Successfully',
                'current_page' => $current_page,
                'total_records' => $total,
                'per_page'   => $this->per_page,
                'insurances' => (object) $insuranceList,
                'doctors' => $doctorList,
                'data' => $list,
                'clinic_list' => $clinicList,
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }

        return response()->json($response);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'last_name'   => 'required',
            'first_name'  => 'required',
            'contact_no'  => 'required',
            'dob'         => 'required',
            'age'         => 'required',
            'doctor_id'   => 'required',
            'gender'      => 'required|string',
            'disease'    => 'sometimes|required',
            'address'     => 'sometimes|required',
            'insurance_id' => 'sometimes|required',
            'city'     => 'sometimes|required',
            'state'     => 'sometimes|required',
            'zipCode'     => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->getMessageBag()]);
        };

        $input = $validator->valid();
        try {
            $input['created_user'] = Auth::id();

            if (!empty($input['dob'])) {
                $input['dob'] = date('Y-m-d', strtotime($input['dob']));
            }

            if (!empty($input['dod'])) {
                $input['dod'] = date('Y-m-d', strtotime($input['dod']));
            }
            
            $patient = Patients::orderBy('id', 'desc')->first();
            
            if (!empty($patient)) {
                $str = $patient->identity ?? "00000000";
                $a = +$str;
                $a = str_pad($a + 1, 8, '0', STR_PAD_LEFT);
                $input['identity'] = $a;
            } else {
                $input['identity'] = "00000001";
            }

            /* Patient Family History */
            $family_history = $input['family_history'] ?? [];
            
            $input['family_history'] = json_encode($family_history);
            $input['clinic_id'] = $request->input('clinic_id');
            $input['change_address'] = $request->input('address');
            $input['change_doctor_id'] = $request->input('doctor_id');

            /* Gettin id after patient create */
            $p_id = Patients::create($input)->id;
            $diagnosis = $input['diagnosis'] ?? [];

            // /* Store Disease in Table */
            if (!empty($diagnosis)) {
                $data = [];
                foreach ($diagnosis as $key => $row) {
                    $created_user = Auth::check()?Auth::id():1;
                    $d_date = Carbon::now();
                    $data2 = [
                        'condition' => $row['condition'],
                        'description' => $row['description'],
                        'status' => $row['status'],
                        'patient_id' => $p_id,
                        'created_user' => $created_user,
                        'created_at' => $d_date
                    ];
                    array_push($data, $data2);
                }

                if (!empty($data)) {
                    DB::table('diagnosis')->insert($data);
                } else {
                    unset($data);
                }
            }
            
            // /* Store Madication in Table */
            $medication = $input['medication'] ?? [];
            if (!empty($medication)) {
                $data = [];
                foreach ($medication as $key => $row) {
                    $created_user = Auth::check()?Auth::id():1;
                    $d_date = Carbon::now();
                    $data2 = [
                        'name' => $row['name'],
                        'dose' => $row['dose'],
                        'condition' => $row['condition'],
                        'status' => "1",
                        'patient_id' => $p_id,
                        'created_user' => $created_user,
                        'created_at' => $d_date
                    ];
                    array_push($data, $data2);
                }



                if (!empty($data)) {
                    DB::table('medications')->insert($data);
                } else {
                    unset($data);
                }
            }
            
            // /* Store surgical Hidtory in table */

            $surgical_history = $input['surgical_history'] ?? [];

            if (!empty($surgical_history)) {
                $data = [];
                foreach ($surgical_history as $key => $row) {
                    $created_user = Auth::check()?Auth::id():1;
                    $date_add = date('Y-m-d', strtotime($row['date']));
                    $d_date = Carbon::now();
                    $data2 = [
                        'procedure' => $row['procedure'],
                        'reason' => $row['reason'],
                        'surgeon' => $row['surgeon'],
                        'date' => $date_add,
                        'status' => "1",
                        'patient_id' => $p_id,
                        'created_user' => $created_user,
                        'created_at' => $d_date
                    ];
                    array_push($data, $data2);
                }



                if (!empty($data)) {
                    DB::table('surgical_history')->insert($data);
                } else {
                    unset($data);
                }
            }


            /*Rizwan Start add for show data*/
            $active = $request->input("active") ?? 1;
            $list = Patients::with('insurance', 'doctor', 'questionServey');

            if ($active == 2) {
                $list = $list->onlyTrashed();
            }

            $list = $list->orderBy('id', 'DESC')->get()->toArray();

            $response = [
                'success' => true,
                'message' => 'Add New Patients Successfully',
                'data' => $list
            ];
            /*end rizwan end add for show data */
        } catch (\Exception $e) {
           $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    
    
    // Edit existing Patient
    public function edit($id)
    {
        try {
            $note = Patients::with('diagnosis')->where('id', $id)->get();
            $note['insurances'] = Insurances::all();

            if ($note) {
                $response = [
                    'success' => true,
                    'message' => 'Sorry Patient not found',
                    'data' => $note
                ];
            }

            $response = [
                'success' => true,
                'message' => 'Patient data Successfully',
                'data' => $note
            ];



        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage()); 
        }

        return response()->json($response);
    }



    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'last_name'  => 'required',
            'first_name' => 'required',
            'contact_no'  => 'required:patients,contact_no,' . $id,
            'dob'        => 'required',
            'age'        => 'required',
            'doctor_id'  => 'required',
            'insurance_id'   => 'required',
            'gender'     => 'required|string',
            'disease'    => 'sometimes|required',
            'address'    => 'sometimes|required',
            'city'       => 'sometimes|required',
            'state'      => 'sometimes|required',
            'zipCode'    => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->getMessageBag()]);
        };

        $input = $validator->valid();
        $note = Patients::find($id);
        try {
            $input['dob'] = date('Y-m-d', strtotime($input['dob']));

            if (!empty($input['dod'])) {
                $input['dod'] = date('Y-m-d', strtotime($input['dod']));
            }

            $created_user =  Auth::check() ? Auth::id() : 1;
            $input['clinic_id'] = Auth::user()->clinic_id;
            $surgical_history = $input['surgical_history'] ?? [];

            $history = [];

            foreach ($surgical_history as $key => $value) {
                $check  = SurgicalHistory::where(['procedure' => $value['procedure'], 'patient_id' => $id])->count();   
                $d_date = Carbon::now();

                if ($check == 0) {
                    $date_add = date('Y-m-d', strtotime($value['date']));

                    $history[] = [
                        'patient_id' => $id,
                        'procedure' => $value['procedure'],
                        'reason' => $value['reason'],
                        'date' => $date_add,
                        'surgeon' => $value['surgeon'],
                        'created_user' => $created_user,
                        'updated_at' => $d_date
                    ];
                }
            }

            if (!empty($history)) {
                SurgicalHistory::insert($history);
            }
                
            // Medications Table Update Data
            $medication = $input['medication'] ?? [];
            $medications = [];

            foreach ($medication as $key => $value) {
                $check  = Medications::where(['name' => $value['name'], 'patient_id' => $id])->count();
                $d_date = Carbon::now();
                
                if ($check == 0) {
                    $medications[] = [
                        'patient_id' => $id,
                        'name' => $value['name'],
                        'dose' => $value['dose'],
                        'condition' => $value['condition'],
                        'created_user' => $created_user,
                        'updated_at' => $d_date,
                    ];
                }
            }

            if (!empty($medications)) {
                Medications::insert($medications);
            }
            
            // Diagnosis Table Update Data
            $diagnos = $input['diagnosis'] ?? [];
            $diagnosis = [];

            foreach ($diagnos as $key => $value) {
                $check  = Diagnosis::where(['condition' => $value['condition'], 'patient_id' => $id])->count();
                $d_date = Carbon::now();
                
                if ($check == 0) {
                    $diagnosis[] = [
                        'patient_id' => $id,
                        'condition' => $value['condition'],
                        'description' => $value['description'],
                        'status' => $value['status'],
                        'created_user' => $created_user,
                        'updated_at' => $d_date,
                    ];
                }
            }

            if (!empty($diagnosis)) {
                Diagnosis::insert($diagnosis);
            }

            /* Patient Family History */
            $family_history = $input['family_history'] ?? [];
            $input['family_history'] = json_encode($family_history);
            
            $note->update($input);
            
            $response = [
                'success' => true,
                'message' => 'Update Patient Record Successfully',
                'data' => $note
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }

        return response()->json($response);
    }
    
    
    public function destroy($id)
    {
        try {
            $note = Patients::find($id);
            $note->delete();

            Questionaires::where('patient_id', $id)->delete();
            
            $response = [
                'success' => true,
                'message' => 'Patients Deleted Successfully',
                'data' => $note
            ];

        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    
    
    public function surgical_history_destroy($id)
    {
        try {
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());

            $data = [
                'deleted_user' => $deleted_user,
                'deleted_at' => $d_date
            ];

            $list = DB::table('surgical_history')->where('id', $id)->limit(1)->update($data);

            $response = [
                'success' => true,
                'message' => 'Surgical History Data Deleted Successfully',
                'data' => $list
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    

    public function surgical_history_spellMistake($id)
    {
        try {
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());

            $data = [
                'status' => "0",
                'deleted_user' => $deleted_user,
                'deleted_at' => $d_date
            ];

            $list = DB::table('surgical_history')->where('id', $id)->limit(1)->update($data);

            $response = [
                'success' => true,
                'message' => 'Surgical History Spell Mistake Data Deleted Successfully',
                'data' => $list
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        
        return response()->json($response);
    }
    
    

    public function medication_destroy($id)
    {
        try {
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());

            $data = [
                'deleted_user' => $deleted_user,
                'deleted_at' => $d_date
            ];
            
            $list = DB::table('medications')->where('id', $id)->limit(1)->update($data);

            $response = [
                'success' => true,
                'message' => 'Medications Data Deleted Successfully',
                'data' => $list
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    

    
    public function medication_spellMistake($id)
    {
        try {
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());
            $data = [
                'status' => "0",
                'deleted_user' => $deleted_user,
                'deleted_at' => $d_date
            ];

            $list = DB::table('medications')->where('id', $id)->limit(1)->update($data);

            $response = [
                'success' => true,
                'message' => 'Medications Spell Mistake Data Deleted Successfully',
                'data' => $list
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    

    
    public function diagnosis_destroy($id)
    {
        try {
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());
            $data = [
                'deleted_user' => $deleted_user,
                'deleted_at' => $d_date,
            ];

            $list = DB::table('diagnosis')->where('id', $id)->limit(1)->update($data);
            $response = [
                'success' => true,
                'message' => 'Diagnosis Deleted Successfully',
                'data' => $list
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    

    
    public function diagnosis_spellMistake($id)
    {
        try {
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());
            $data = [
                'display' => "0",
                'deleted_user' => $deleted_user,
                'deleted_at' => $d_date,
            ];
            
            $list =    DB::table('diagnosis')->where('id', $id)->limit(1)->update($data);
            
            $response = [
                'success' => true,
                'message' => 'Diagnosis Spell Mistake Record Deleted Successfully',
                'data' => $list
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    

    public function status_change($id)
    {
        try {
            $selectedValue = $_POST['selected'];
            $deleted_user = Auth::id();
            $d_date = Carbon::now(); //date("Y-m-d h:i:s a", time());
            
            if ($selectedValue == "Inactive") {
                $data = [
                    'deleted_at' => $d_date,
                ];
                
                $list = DB::table('patients')->where('id', $id)->limit(1)->update($data);
                $response = [
                    'success' => true,
                    'message' => 'Patient Inactive Successfully',
                    'data' => $list
                ];
            } else if ($selectedValue == "Active") {
                $data = [
                    'deleted_at' => NULL,
                ];
                
                $list = DB::table('patients')->where('id', $id)->limit(1)->update($data);
                $response = [
                    'success' => true,
                    'message' => 'Patient Active Successfully',
                    'data' => $list
                ];
            }
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }


    public function addDiagnosis(Request $request)
    {
        $input = $request->all();
        try {
            $patient_id = $input['patient_id'];
            $insertData = [
                'patient_id' => $patient_id,
                'created_user' => Auth::check()?Auth::id():1,
                'condition' => $input['condition'],
                'description' => $input['description'],
                'status' => $input['status'],
                'created_at' => Carbon::now()
            ];

            $insert = Diagnosis::insert($insertData);

            $patient_diagnosis = Diagnosis::where('patient_id', $patient_id)->get();

            $response = [
                'success' => true,
                'message' => 'Diagnosis Added Successfully',
                'data' => $patient_diagnosis
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    


    public function addMedications(Request $request)
    {
        $input = $request->all();
        try {
            $patient_id = $input['patient_id'];
            $insertData = [
                'patient_id' => $patient_id,
                'created_user' => Auth::check()?Auth::id():1,
                'name' => $input['name'],
                'dose' => $input['dose'],
                'condition' => $input['condition'],
                'created_at' => Carbon::now()
            ];

            $insert = Medications::insert($insertData);
            $patient_medications = Medications::where('patient_id', $patient_id)->get();

            $response = [
                'success' => true,
                'message' => 'Medication Added Successfully',
                'data' => $patient_medications
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }
    



    /* Add surgery from patient profile */
    public function addSurgeries(Request $request)
    {
        $input = $request->all();
        try {
            $patient_id = $input['patient_id'];
            $surgery_date = $date_add = date('Y-m-d', strtotime($input['date']));
            $insertData = [
                'patient_id' => $patient_id,
                'created_user' => Auth::check()?Auth::id():1,
                'procedure' => $input['procedure'],
                'reason' => $input['reason'],
                'date' => $surgery_date,
                'surgeon' => $input['surgeon'],
                'created_at' => Carbon::now()
            ];

            $insert = SurgicalHistory::insert($insertData);

            $patient_diagnosis = SurgicalHistory::where('patient_id', $patient_id)->get();

            $response = [
                'success' => true,
                'message' => 'Surgery Added Successfully',
                'data' => $patient_diagnosis
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return response()->json($response);
    }


    /* Get Patient Enounters */
    public function getEncounters($id)
    {
        try {
            $encounters = Questionaires::where('patient_id', $id)->get()->toArray();
            if ($encounters) {
                $response = [
                    'success' => true,
                    'message' => 'Medication Added Successfully',
                    'data' => $encounters
                ];
            }
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }

        return response()->json($response);
    }


    /* Get Insureance and Doctors against Clinins  */
    public function getInsuracneandPcp($clinicId)
    {
        /* Getting Doctors from user table against clinic id */
        $doctorList = User::whereHas('clinicUser', function($query) use ($clinicId) {
            $query->where('clinic_id', $clinicId);
        })->where("role", 21)->get()->toArray();

        $pcp = [];
        foreach ($doctorList as $key => $value) {
            $pcp[] = ['id' => $value['id'], 'name'=> $value['name']];
        }

        $insurancesList = Insurances::where('clinic_id', $clinicId)->select('id', 'name')->get()->toArray();

        $response = [
            'insurances' => $insurancesList,
            'doctors' => $pcp,
        ];

        return response()->json($response);

    }



}



