<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        
        $rules = [
            'email'=>'required|email',
            'password'=>'required|min:4|max:30',
            'name'=>'required|string|min:2|max:30',
            'role'=>'required|in:director,employee'
        ];

        if($this->role == 'employee'){
            $rules['QRcode']='required|string|min:5';
        }
        return $rules;
    }
}
