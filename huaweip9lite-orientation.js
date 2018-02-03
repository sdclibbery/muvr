(function () {

muvr.huaweiP9LiteOrientation = {
  isHuaweiP9Lite: (agent) => agent.toUpperCase().includes('HUAWEI VNS-L31'),
  orientate: (alpha, beta, gamma) => {
    const lookingUp = (gamma > 0)
    if (lookingUp) {
      beta = 180 - beta
      gamma = gamma - 180
    }
    let ori = {
      yaw: alpha,
      pitch: -gamma,
      roll: beta
    };
    ori.yaw = -beta*2
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
const ho = muvr.huaweiP9LiteOrientation

test('desktop agent',
  false,
  ho.isHuaweiP9Lite('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36')
)
test('phone agent',
  true,
  ho.isHuaweiP9Lite('Mozilla/5.0 (Linux; Android 6.0; HUAWEI VNS-L31 Build/HUAWEIVNS-L31) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36')
)

test('beta used for roll in landscape on phone', 2, ho.orientate(1,2,0).roll)
test('gamma used for pitch in landscape on phone', 0, ho.orientate(1,2,0).pitch)
test('yaw does not come from alpha, because its unreliable on phone', 0, ho.orientate(211,0,-80).yaw)
test('yaw comes from inverted roll', -20, ho.orientate(0,10,0).yaw)
test('pitch is inverted gamma when looking down', 80, ho.orientate(0,0,-80).pitch)
test('pitch is modified gamma when looking up', 100, ho.orientate(0,0,80).pitch)
test('beta jumps and reverses when looking up', -10, ho.orientate(0,190,80).roll)

})();
