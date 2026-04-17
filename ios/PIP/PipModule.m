#import <Foundation/Foundation.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import "React/RCTBridgeModule.h"
#endif

@interface RCT_EXTERN_MODULE(PipModule, NSObject)

RCT_EXTERN_METHOD(setEnabled:(BOOL)enabled)
RCT_EXTERN_METHOD(enterPipMode)

@end
