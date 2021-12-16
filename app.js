const form = document.getElementById('form');
let newData = data;

function onInputRange(element) {
  document.getElementById(element.id + '-span').innerText = element.value
}

function filterFunction(fd, id, value, pr) {
  let res = fd

  if (id === 'region')
    res = fd.filter(university => university.region === value)

  if (id === 'education-form')
    res = fd.filter(university =>
        university.specialties.some(spec => spec.form === value)
    )

  if (id === 'branch')
    res = fd.filter(university =>
        university.specialties.some(spec => spec.branch === value)
    )
  if (id === 'educational-program')
    res = fd.filter(university =>
        university.specialties.some(spec => (spec.educationalProgram) ? spec.educationalProgram.search(value) > -1 : false)
    )

  if (id === 'offer-type')
    res = fd.filter(university =>
        university.specialties.some(spec => (spec.offerType) ? spec.offerType.search(value) > -1 : false)
    )

  if (id === 'specialty')
    res = fd.filter(university =>
        university.specialties.some(spec => spec.specialty === value)
    )

  if (id === 'technical-or-humanitarian')
    res = fd.filter(university =>
        university.specialties.some(spec => {
          if (value === 'Технічні науки')
            return (+spec.specialty.slice(0, 3) > 100 && +spec.specialty.slice(0, 3) < 200)
          else
            return (+spec.specialty.slice(0, 3) < 100 || +spec.specialty.slice(0, 3) > 200)
        })
    )

  if (id === 'subject1' ||
      id === 'subject2' ||
      id === 'subject3')
    res = fd.filter(university =>
        university.specialties.some(spec =>
            spec.subjects.some(sub => sub.subject.search(value) > -1 && +sub.k > 0)//=== value && +sub.k > 0)
        )
    )

  return (res.length || pr > 4) ? res : fd;
}

function handleSubmitForm(e) {

  e.preventDefault();

  let result = '',
      prioritiesArray = Array.from(document.getElementsByClassName('priority')).sort((a, b) => {
        if (+a.value < +b.value)
          return 1
        else
          return -1
      }), filteredData = newData;

  prioritiesArray.forEach(elem => {
    let inputID = elem.id.slice(3, elem.id.length),
        input = document.getElementById(inputID);

    if (input && (inputID === 'rate' || inputID === 'certificate') ? input.checked : input.value)

    filteredData = filterFunction(
        filteredData,
        inputID,
        (inputID === 'rate' || inputID === 'certificate') ? input.checked : input.value,
        +elem.value
    )
  })

  filteredData = filteredData.sort((a, b) => {
    if (+a.rate > +b.rate)
      return 1
    else
      return -1
  });

  console.clear()

  let arr = Array(filteredData.length)
      .fill(1)
      .map((v, i, a) => a.length - i),
      sum = arr.reduce((prev, curr) => prev + curr, 0);

  filteredData.forEach((un, index, ar) => {
    let prob = -(100 / sum) * index + ar.length * (100 / sum)
    // console.log(prob);
    result += un.universityName + '\n> ' + prob.toFixed(5) + "%\n\n";
  })

  alert(result);

}
