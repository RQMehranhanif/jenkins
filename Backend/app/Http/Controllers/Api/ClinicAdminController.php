<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClinicAdminCollection;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\ClinicUser;
use Auth,Validator,DB;
use Carbon\Carbon;

class ClinicAdminController extends Controller
{
    protected $per_page = '';
	public function __construct(){
	    $this->per_page = Config('constants.perpage_showdata');
	}


    //Show all users data
    public function index(Request $request)
    {
        $roles = Config('constants.roles');
        $query = User::whereHas('clinicUser')->with('clinicUser.clinic');
        
        /* For Search Query in clinic users */
        if ($request->has('search') && !empty($request->input('search'))) {
            $search = $request->get('search');
            $query = $query->where('first_name', 'like', '%' . $search . '%')->orWhere('last_name', 'like', '%' . $search . '%');
        }

        $query = $query->paginate($this->per_page);
        $total = $query->total();
        $current_page = $query->currentPage();
        $result = $query->toArray();

        $list = [];
        foreach($result['data'] as $key => $val) {
            $list[] = [
                'id' => $val['id'],
                'name' => $val['name'],
                'first_name' => $val['first_name'],
                'mid_name' => $val['mid_name'],
                'last_name' => $val['last_name'],
                'email' => $val['email'],
                'contact_no' => $val['contact_no'],
                'clinic' => @$val['clinic_user']['clinic']['name'],
                'role' => $val['role'],
                'role_name' => @$roles[$val['role']],
            ];
        }


        $clinics = Clinic::get()->toArray();
        $clinics_data = []; 
        foreach($clinics as $key => $val) {
            $clinics_data[] = [
                'id' => $val['id'],
                'name' => $val['name'],
            ];
        }

        $response = [
            'success' => true,
            'message' => 'ClinicAdmins Data Retrived Successfully',
            'current_page' => $current_page,
            'total_records' => $total,
            'per_page'   => $this->per_page,
            'roles_data' => $roles,
            'clinics' =>$clinics_data,
            'data' => $list
        ];

        try {
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }
        
        return response()->json($response);
    }



  



    



    public function create()
    {
        $data['clinicName'] = DB::table('clinics')->get()->toArray();
        return view($this->view.'create',$data);
    }







    /**



     * Store a newly created resource in storage.



     *



     * @param  \Illuminate\Http\Request  $request



     * @return \Illuminate\Http\Response



     */



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'first_name'  => 'required',
            'last_name'   => 'required',
            'contact_no'  => 'required',
            'email'  => 'required|unique:users',
            'address'     => 'sometimes|required',
            'password'    => 'required',
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'errors'=>$validator->getMessageBag()]);
        };

        $input = $validator->valid();
        try {
            $input['created_user'] = Auth::id();
            $input['mid_name'] = $request->mid_name;
            $input['role'] = $request->role;    
            $input['password'] = Hash::make($request->password);
            $user = User::create($input);

            $clinic_user['created_user'] = Auth::id();
            $clinic_user['clinic_id'] = $request->clinic_id;
            $clinic_user['user_id'] = $user['id'];
            $c_user = ClinicUser::create($clinic_user);

            $data = [
                'first_name' => $user['first_name'],
                'mid_name' => $user['mid_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'password' =>$user['password'],
                'address' =>$user['address'],
                'contact_no'  => $user['contact_no'],
                'role' =>$user['role'],
                'created_user' => $user['created_user'],
                'clinic_id' =>$c_user['clinic_id'],
                'created_at' => $user['created_at'],
                'updated_at' =>$user['updated_at']
            ];

            $response = [
                'success' => true,
                'message' => 'New Clinic User Created Successfully',
        		'data' => $data
            ];
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }



       return response()->json($response);







    }







    /**



     * Show the form for editing the specified resource.



     *



     * @param  int  $id



     * @return \Illuminate\Http\Response



     */







    /**



     * Update the specified resource in storage.



     *



     * @param  \Illuminate\Http\Request  $request



     * @param  int  $id



     * @return \Illuminate\Http\Response



     */



    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            'first_name'  => 'required',
            'last_name'   => 'required',
            'mid_name'    => '',
            'contact_no'  => 'required',
            'clinic_id'   => 'required',
            'role'        => 'required',
            'address'     => 'sometimes|required',
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'errors'=>$validator->getMessageBag()]);
        };



        $input = $validator->validated();

        try {
            $c_user = ClinicUser::where('user_id', $id)->update(['clinic_id' => $input['clinic_id']]);
            unset($input['clinic_id']);

	        $user = User::where('id',$id)->first();



            $userUpdate = $user->update($input);

	        $user = User::where('id',$id)->first();

            $note = [
                'first_name' => $user['first_name'],
                'mid_name' => $user['mid_name'],
                'last_name' => $user['last_name'],
                'clinic_id' => $user['clinic_id'],
                'address' =>$user['address'],
                'contact_no'  => $user['contact_no'],
                'role' =>$user['role'],
                'created_user' => $user['created_user'],
                'created_at' => $user['created_at'],
                'updated_at' =>$user['updated_at']
            ];

            $response = [
                'success' => true,
                'message' => 'Clinic User Updated Successfully',
                'data' => $note
            ];
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }

       return response()->json($response);
    }







    /**



     * Remove the specified resource from storage.



     *



     * @param  int  $id



     * @return \Illuminate\Http\Response



     */



    public function destroy($id)



    {



        try {



            $note = user::find($id);



            $note->delete();



            $response = [



                'success' => true,



                'message' => 'Clinic User Deleted Successfully',



                'data' => $note



            ];



        } catch (\Exception $e) {



            $response = array('success'=>false,'message'=>$e->getMessage()); 



        }



        return response()->json($response);



    }







     public function edit($id)



    {



        try {



            $note = clinicUser::find($id);



            if ($note) 



            {



               $response = [



                'success' => true,



                'message' => 'Sorry clinic User Not Find',



                'data' => $note



                ];



            }







            $response = [



                'success' => true,



                'message' => 'clinic User Data Fetch Successfully',



                'data' => $note



            ];



        } catch (\Exception $e) {



            $response = array('success'=>false,'message'=>$e->getMessage()); 



        }



        return response()->json($response);



    }



}



