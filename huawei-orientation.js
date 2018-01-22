(function () {

muvr.huaweiOrientation = {
  isHuawei: (agent) => agent.toLowerCase().includes('huawei')
};

// TESTS
const test = (name, expected, actual) => {
  if (expected !== actual) {
    const msg = `Test '${name}' failed! expected ${expected} but got ${actual}`
    console.log(msg)
    alert(msg)
  }
}
const ho = muvr.huaweiOrientation

test('desktop agent',
  false,
  ho.isHuawei('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36')
)

test('phone agent',
  true,
  ho.isHuawei('Mozilla/5.0 (Linux; U; Android 4.2.2; nl-nl; HUAWEI P6-U06 Build/HuaweiP6-U06) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30')
)

})();
