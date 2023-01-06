const filterProductByForm = async(userdata, docs) => {
  // get all the form in a array based on availablity in user.
  var forms = [];
  if(userdata.cert_form20 != "")
  {
      forms.push('form_20')
  }
  if(userdata.cert_form21 != "")
  {
      forms.push('form_21')
  }
  if(userdata.cert_form20b != "")
  {
      forms.push('form_20b')
  }
  if(userdata.cert_form21b != "")
  {
      forms.push('form_21b')
  }
  if(userdata.cert_form20d != "")
  {
      forms.push('form_20d')
  }
  if(userdata.cert_form20c != "")
  {
      forms.push('form_20c')
  }
  if(userdata.cert_fssai_central !="")
  {
      forms.push('fssai_central')
  }
  if(userdata.cert_insecticide !="")
  {
      forms.push('fssai_state')
  }
  if(userdata.cert_fssai_state !="")
  {
      forms.push('form_insecticide')
  }
  
  var products = [];
  
  //run loop on product
  var allowed_cert = [];
  //run loop on product
  for(item of docs)
  {
    allowed_cert = item.allowed_cert.split(',');
    //run loop in user certificate
    for(element of forms)
    {
      if(allowed_cert.includes(element))
      {
        products.push(item);
        break;
      }
    } 
  }
  
  // console.log(forms);
  return products;
} 
// module.exports = { generateToken };
module.exports = {filterProductByForm};