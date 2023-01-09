<?php







namespace App\Http\Controllers\Api;







use App\Http\Controllers\Controller;



use App\Http\Resources\ProgramsCollection;



use App\Models\Programs;



use Illuminate\Http\Request;



use Validator;



use Auth;



use Illuminate\Support\Str;







class ProgramController extends Controller



{



    protected $singular = "Program";



    protected $plural   = "Programs";



    protected $per_page = '';
	public function __construct(){
	$this->per_page = Config('constants.perpage_showdata');

	}




    public function index(Request $request)



    {



        try {



            $query  = new Programs();



            if ($request->has('search') && !empty($request->input('search'))) {



                $search = $request->get('search');



                $query = $query->where('name', 'like', '%' . $search . '%');



            }







            $row = $query->paginate($this->per_page);



            $total = $row->total();



            $current_page = $row->currentPage();



            $programs = ProgramsCollection::collection($row);



            $key = $request->get('search');







            return response()->json([



                'success' => true,



                'total' => $total,



                'current_page' => $current_page,



                'per_page' => $this->per_page,



                'data' => $programs



            ], 200);



        } catch (\Exception $e) {



            $response = array('success' => false, 'message' => $e->getMessage());



        }



    }







    public function single($id)



    {



        try {



            $program = Programs::find($id);



            if (!$program) {



                return response()->json([



                    "message" => "Program not found"



                ]);



            }



            $program_resource = new ProgramsCollection($program);



            return response()->json([



                'program' => $program_resource



            ]);



        } catch (\Exception $e) {



            $response = array('success' => false, 'message' => $e->getMessage());



        }



    }







    public function store(Request $request)



    {



        $validator = Validator::make($request->all(), [



            'name' => 'required',



            'short_name'  => 'required'



        ]);



        if ($validator->fails()) {



            return response()->json(['success' => false, 'errors' => $validator->getMessageBag()]);



        };







        try {



            $program = new Programs();



            $program->created_user = Auth::id();



            $program->slug = Str::slug($request->name);



            $program->name = $request->name;



            $program->short_name = $request->short_name;



            $program->save();



            return response()->json([



                'success' => true,



                "message" => "Program Added Successfully"



            ]);



        } catch (\Exception $e) {



            $response = array('success' => false, 'message' => $e->getMessage());



        }



        return response()->json($response);



    }



    public function update(Request $request, $id)



    {



        $validator = Validator::make($request->all(), [



            'name' => 'required',



            'short_name'  => 'sometimes|required'



        ]);



        if ($validator->fails()) {



            return response()->json(['success' => false, 'errors' => $validator->getMessageBag()]);



        };



        $input = $validator->valid();



        $note = Programs::find($id);



        try {



            $note->name = $request->name;



            $note->short_name = $request->short_name;



            $note->created_user = Auth::id();



            $note->slug = Str::slug($request->name);



            $note->update();



            return response()->json([



                "success" => true,



                "message" => "Program has been edited successfully"



            ], 200);



            // $response = array('success' => true, 'message' => $this->singular . ' Updated Successfully', 'action' => 'reload');



        } catch (\Exception $e) {



            $response = array('success' => false, 'message' => $e->getMessage());



        }



        return response()->json($response);



    }



    public function destroy($id)



    {



        try {



            $note = Programs::find($id);



            $note->delete();



            return response()->json([



                "success" => true,



                "message" => "Program deleted successfully"



            ], 200);



        } catch (\Exception $e) {



            $response = array('success' => false, 'message' => $e->getMessage());



        }



        return response()->json($response);



    }



}



