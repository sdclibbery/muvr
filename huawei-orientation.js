(function () {

muvr.huaweiOrientation = {
  isHuawei: (agent) => agent.toLowerCase().includes('huawei'),
  orientate: (alpha, beta, gamma) => {
    let ori = {
      yaw: alpha,
      pitch: gamma<=0 ? -gamma : 180-gamma,
      roll: beta
    };
    ori.yaw = -beta
    return ori
  }
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

test('beta used for roll in landscape on phone', 2, ho.orientate(1,2,3).roll)
test('gamma used for pitch in landscape on phone', 0, ho.orientate(1,2,0).pitch)
test('yaw does not come from alpha, because its unreliable on phone', 0, ho.orientate(211,0,-80).yaw)
test('yaw comes from inverted roll', -10, ho.orientate(0,10,0).yaw)
test('pitch is inverted gamma when looking down', 80, ho.orientate(0,0,-80).pitch)
test('pitch is modified gamma when looking up', 100, ho.orientate(0,0,80).pitch)

})();
