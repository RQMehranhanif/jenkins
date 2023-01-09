<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\QuestionaireController;
use App\Http\Controllers\Api\QuestionnaireController;
use App\Http\Controllers\Api\ClinicController;
use App\Http\Controllers\Api\SuperBillCodesController;
use App\Http\Controllers\Api\ClinicAdminController;
use App\Http\Controllers\Api\PatientsController;
use App\Http\Controllers\Api\InsurancesController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SpecialistController;
use App\Http\Controllers\Api\PhysiciansController;
use App\Http\Controllers\Api\CareplanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:passport')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class,'login']);

Route::group(['middleware'=>['auth:api']],function(){

    // Users ROUTES
    Route::get('users' , [UserController::class,'index']);
    Route::post('user/create' , [UserController::class,'store']);
    Route::get('user/edit/{id}' , [UserController::class,'edit']);
    Route::post('user/update/{id}' , [UserController::class,'update']);
    Route::post('user/delete/{id}' , [UserController::class,'destroy']);
    Route::post('logout', [UserController::class,'logout']);

    // Clinics ROUTES
    Route::get('clinics',  [ClinicController::class,'index']);
    Route::post('clinic/create' , [ClinicController::class,'store']);
    Route::post('clinic/update/{id}' , [ClinicController::class,'update']);
    Route::get('clinic/edit/{id}' , [ClinicController::class,'edit']);
    Route::post('clinic/delete/{id}' , [ClinicController::class,'destroy']);

    // ClinicAdmin ROUTES
    Route::get('clinicAdmins',  [ClinicAdminController::class,'index']);
    Route::post('clinicAdmin/create' , [ClinicAdminController::class,'store']);
    Route::get('clinicAdmin/edit/{id}' , [ClinicAdminController::class,'edit']);
    Route::post('clinicAdmin/update/{id}' , [ClinicAdminController::class,'update']);
    Route::post('clinicAdmin/delete/{id}' , [ClinicAdminController::class,'destroy']);

    // Patients ROUTES
    Route::get('patients',  [PatientsController::class,'index']);
    Route::post('patient/create' , [PatientsController::class,'store']);
    Route::get('patient/edit/{id}' , [PatientsController::class,'edit']);
    Route::post('patient/update/{id}' , [PatientsController::class,'update']);
    Route::post('patient/delete/{id}' , [PatientsController::class,'destroy']);
    Route::post('patient/add-disease', [PatientsController::class, 'addDiagnosis']);
    Route::post('patient/add-medication', [PatientsController::class, 'addMedications']);
    Route::post('patient/add-surgery', [PatientsController::class, 'addSurgeries']);
    Route::get('patient/encounters/{id}', [PatientsController::class, 'getEncounters']);
    Route::get('patient/insurance-pcp/{id}', [PatientsController::class, 'getInsuracneandPcp']);

    // for ajax call request soft delection 
    Route::delete('surgical_history_destroy/{id}' , [PatientsController::class,'surgical_history_destroy']);
    Route::get('surgical_history_spellMistake/{id}' , [PatientsController::class,'surgical_history_spellMistake']);
    Route::delete('diagnosis_destroy/{id}' , [PatientsController::class,'diagnosis_destroy']);
    Route::get('diagnosis_spellMistake/{id}' , [PatientsController::class,'diagnosis_spellMistake']);
    Route::delete('medication_destroy/{id}' , [PatientsController::class,'medication_destroy']);
    Route::get('medication_spellMistake/{id}' , [PatientsController::class,'medication_spellMistake']);
    Route::post('status_change/{id}', [PatientsController::class,'status_change']);
    //Route::post('Inactive_patients', [PatientsController::class,'Inactive_patients']);
    
    // insurances ROUTES
    Route::get('insurances',  [InsurancesController::class,'index']);
    Route::post('insurance/create' , [InsurancesController::class,'store']);
    Route::get('insurance/edit/{id}' , [InsurancesController::class,'edit']);
    Route::post('insurance/update/{id}' , [InsurancesController::class,'update']);
    Route::post('insurance/delete/{id}' , [InsurancesController::class,'destroy']);

    // ScheduleControlle ROUTES
    Route::get('schedules',  [ScheduleController::class,'index']);
    Route::post('schedule/create' , [ScheduleController::class,'store']);
    Route::get('schedule/edit/{id}' , [ScheduleController::class,'single']);
    Route::post('schedule/update/{id}' , [ScheduleController::class,'update']);
    Route::post('schedule/delete/{id}' , [ScheduleController::class,'destroy']);
    Route::get('dashboard',  [DashboardController::class,'index']);
    // Route::get('dashboard/doctor/{data}' , [DashboardController::class,'doctor_id']);

    //Specialist
    Route::delete('specialist/delete/{id}', [SpecialistController::class, 'destroy']);
    Route::post('specialist/create', [SpecialistController::class, 'store']);
    Route::get('specialist', [SpecialistController::class, 'index']);
    Route::get('specialist/list', [SpecialistController::class, 'list']);
    Route::post('specialist/update/{id}', [SpecialistController::class, 'update']);
    Route::get('specialist/edit/{id}', [SpecialistController::class, 'single']);

    //Insurance
    Route::get('insurance', [InsurancesController::class, 'index']);
    Route::get('insurance/edit/{id}', [InsurancesController::class, 'single']);
    Route::post('insurance/create', [InsurancesController::class, 'store']);
    Route::post('insurance/update/{id}', [InsurancesController::class, 'update']);
    Route::delete('insurance/delete/{id}', [InsurancesController::class, 'destroy']);

    //Programs
    Route::get('programs', [ProgramController::class, 'index']);
    Route::post('program/create', [ProgramController::class, 'store']);
    Route::post('program/update/{id}', [ProgramController::class, 'update']);
    Route::delete('program/delete/{id}', [ProgramController::class, 'destroy']);
    Route::get('program/edit/{id}', [ProgramController::class, 'single']);

    //Physician
    Route::get('physicians', [PhysiciansController::class, 'index']);
    Route::post('physician/create', [PhysiciansController::class, 'store']);
    Route::post('physician/update/{id}', [PhysiciansController::class, 'update']);
    Route::delete('physician/delete/{id}', [PhysiciansController::class, 'destroy']);
    Route::get('physician/edit/{id}', [PhysiciansController::class, 'single']);

    /* CAREPLAN Routes */
    Route::get('careplan/awv-careplan/{id}', [CareplanController::class,'index']);
    Route::get('careplan/ccm-careplan/{id}', [CareplanController::class,'ccmCareplanReport']);
    Route::get('careplan/filledquestionnaire/{id}', [CareplanController::class,'filledQuestionnaire']);
    Route::get('careplan/careplanpdf/{id}', [CareplanController::class,'downloadCareplanpdf']);
    Route::post('careplan/savesignature/{id}', [CareplanController::class,'saveSignature']);

    // QUESTIONNAIRE ROUTES
    Route::apiResource('questionaire' , QuestionaireController::class);
    Route::post('questionaire/edit/{id}' , [QuestionaireController::class, 'edit']);
    Route::post('questionaire/superbill/{id}' , [QuestionaireController::class, 'superbill']);
    Route::post('questionaire/update/{id}' , [QuestionaireController::class, 'update']);
    Route::post('questionaire/delete/{id}' , [QuestionaireController::class, 'destroy']);
    Route::post('questionaire/get-programm-data', [QuestionaireController::class,'getProgramms']);
    Route::post('questionaire/abc', [QuestionaireController::class,'storeMonthlyAssessment']);
    
    /* SuperBill Codes Routes */
    Route::get('superbill/{id}', [SuperBillCodesController::class,'index']);
    Route::post('superbill/add-code', [SuperBillCodesController::class,'store']);
    Route::post('superbill/update-code', [SuperBillCodesController::class,'update']);
    Route::post('superbill/delete-code', [SuperBillCodesController::class,'destroy']);
    Route::post('superbill/delete-dx-code', [SuperBillCodesController::class,'destroy_dx']);
    Route::get('superbill/super-bill/{id}', [SuperBillCodesController::class,'downloadSuperBill']);

});

Route::get('checkcareplan/{id}', [CareplanController::class,'checkCareplanHtml']);
Route::get('checksuperbill/{id}', [SuperBillCodesController::class,'superbillHtml']);