<?php



namespace App\Http\Controllers\Api;



use App\Http\Controllers\Controller;

use App\Http\Resources\InsuranceCollection;

use App\Http\Resources\ProgramsCollection;

use Illuminate\Http\Request;

use App\Models\Insurances;

use App\Models\Programs;

use Auth, Validator, Str;



class InsurancesController extends Controller

{

    protected $singular = "Insurance";

    protected $plural   = "Insurances";

    protected $action   = "/dashboard/insurances";

    protected $view     = "insurances.";




    protected $per_page = '';
	public function __construct(){
	$this->per_page = Config('constants.perpage_showdata');

	}





    public function index(Request $request)

    {

        try {

            $query  = new Insurances();

            if ($request->has('search') && !empty($request->input('search'))) {

                $search = $request->get('search');

                $query = $query->where('name', 'like', '%' . $search . '%');

            }


            $row = $query->paginate($this->per_page);
            $total = $row->total();

            $current_page = $row->currentPage();

            $insurances = InsuranceCollection::collection($row);

            return response()->json([

                'success' => true,

                'total' => $total,

                'current_page' => $current_page,

                'per_page' => $this->per_page,

                'data' => $insurances

            ]);

        } catch (\Exception $e) {

            $response = array('success' => false, 'message' => $e->getMessage());

        }

    }



    public function single($id)

    {

        try {

            $program = Insurances::find($id);

            if (!$program) {

                return response()->json([

                    "message" => "Insurance not found"

                ]);

            }

            $insurance_resource = new InsuranceCollection($program);

            return response()->json([

                'insurance' => $insurance_resource

            ]);

        } catch (\Exception $e) {

            $response = array('success' => false, 'message' => $e->getMessage());

        }

    }



    /**

     * Show the form for creating a new resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function create()

    {

        $data = [

            'singular' => $this->singular,

            'plural'   => $this->plural,

            'action'   => $this->action

        ];

        return view($this->view . 'create', $data);

    }



    /**

     * Store a newly created resource in storage.

     *

     * @param  \Illuminate\Http\Request  $request

     * @return \Illuminate\Http\Response

     */

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

            $insurance = new Insurances();

            $insurance->created_user = Auth::id();
            $insurance->name = $request->name;
            $insurance->short_name = $request->short_name;
            $insurance->clinic_id = Auth::user()->clinic_id ?? 1;

            $insurance->save();

            return response()->json([

                'success' => true,

                'data' => $insurance,

                "message" => "Insurance Added Successfully"

            ]);

        } catch (\Exception $e) {

            $response = array('success' => false, 'message' => $e->getMessage());

        }

        return response()->json($response);

    }



    // Edit existing clinic



    public function edit($id)



    {



        try {



            $note = Insurances::find($id);



            if ($note) 



            {



               $response = [



                'success' => true,



                'message' => 'Sorry Insurance Not Found',



                'data' => $note



                ];



            }







            $response = [



                'success' => true,



                'message' => 'Insurance data Successfully',



                'data' => $note



            ];



        } catch (\Exception $e) {



            $response = array('success'=>false,'message'=>$e->getMessage()); 



        }



        return response()->json($response);



    }



    /**

     * Update the specified resource in storage.

     *

     * @param  \Illuminate\Http\Request  $request

     * @param  int  $id

     * @return \Illuminate\Http\Response

     */

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

        $note = Insurances::find($id);

        try {



            $note->update($input);

            $response = array('success' => true, 'data' => $note, 'message' => $this->singular . ' Updated Successfully', 'action' => 'reload');

        } catch (\Exception $e) {

            $response = array('success' => false, 'message' => $e->getMessage());

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

            $note = Insurances::find($id);

            $note->delete();

            $response = array('success' => true, 'message' => $this->singular . ' Deleted!');

        } catch (\Exception $e) {

            $response = array('success' => false, 'message' => $e->getMessage());

        }

        return response()->json($response);

    }

}